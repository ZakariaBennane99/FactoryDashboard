import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
/* eslint-disable camelcase, class-methods-use-this */

/**
 * The JwtService class is a utility class for handling JSON Web Tokens (JWTs) in the Fuse application.
 * It provides methods for initializing the service, setting interceptors, and handling authentication.
 */
class JwtService extends FuseUtils.EventEmitter {
	/**
	 * Initializes the JwtService by setting interceptors and handling authentication.
	 */
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	/**
	 * Sets the interceptors for the Axios instance.
	 */
	setInterceptors = () => {
		axios.interceptors.response.use(
			(response) => response,
			(err) =>
				new Promise(() => {
					if (err?.response?.status === 401 && err.config) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						_setSession(null);
					}
					throw err;
				})
		);
	};

	/**
	 * Handles authentication by checking for a valid access token and emitting events based on the result.
	 */
	handleAuthentication = () => {
		const access_token = getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');
			return;
		}

		if (isAuthTokenValid(access_token)) {
			console.log('AUTOLOGINBABAY')
			_setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			_setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	/**
	 * Signs in with the provided email and password.
	 */
	signInWithEmailAndPassword = (userName, password) =>
		new Promise((resolve, reject) => {
			axios  
			    // jwtServiceConfig.signIn to be with api/auth/signIn, 
				// try to get the access_token too
				.post(`http://localhost:3002/auth/login`, {
					username: userName,
					password
				})
				.then(
					(
						response
					) => {
						// here everytihng will be returned by the backend
						if (response.data.data.user) {
							_setSession(response.data.data.access_token);
							// to be implemented later on <response.data.user>
							// category of the user
							this.emit('onLogin', response.data.data.user);
							resolve(response.data.data.user);
						} else {
							reject(response.data.data.message);
						}
					}
				);
		});

	/**
	 * Signs in with the provided token.
	 */
	signInWithToken = () =>
    new Promise((resolve, reject) => {
        const accessToken = getAccessToken();
		console.log('The acce', accessToken)
        if (!accessToken) {
            this.logout();
            reject(new Error('No token provided. Please log in!'));
            return;
        }

        axios
            .get(`http://localhost:3002/auth/session`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then((response) => {
                if (response.status === 200) {
					console.log('THE RES FROM SESSION', response)
                    // Assuming the successful response doesn't necessarily return user data anymore,
                    // but just validates the session. You might need to adjust this part based on your actual response structure.
                    resolve(response.data.user);
                } else {
                    // This block might not be necessary if your axios setup rejects non-2xx statuses,
                    // but it's here to illustrate handling different responses.
                    this.logout();
                    reject(new Error(response.data.message || 'Failed to validate session.'));
                }
            })
            .catch((error) => {
                // This will catch network errors and any status codes that fall outside the 2xx range.
                this.logout();
                const message = error.response ? error.response.data.message : 'Failed to login with token.';
                reject(new Error(message));
            });
    });/*
	signInWithToken = () =>
		new Promise((resolve, reject) => {
			axios
				.get(`http://localhost:3002/auth/session`, {
					data: {
						access_token: getAccessToken()
					}
				})
				.then((response) => {
					if (response.data.user) {
						_setSession(response.data.access_token);
						resolve(response.data.user);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(() => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});*/

	/**
	 * Creates a new item.
	 */
	createItem = (itemInfo, headers) =>
	new Promise((resolve, reject) => {
			axios.post(`http://localhost:3002/${itemInfo.itemType}`, itemInfo.data, headers).then(
				(
					response
				) => {
					if (response.data) {
						// resolve with a success message and 201 code
						resolve(response); 
					} else {
						reject(response);
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error'
						// 2. 'You don't have permission to edit' (forbidden)
						// 3. '<element/elements> is/are already in use!'
					}
				}
			);
	});	

	/**
	 * Updates an item.
	 */
	updateItem = (itemInfo, headers) =>
		new Promise((resolve, reject) => {
			axios.put(`http://localhost:3002/${itemInfo.itemType}/${itemInfo.data.itemId}`, itemInfo.data.data, headers).then(
				(response) => {
					if (response.data) {
						resolve(response.data); // return a ok msg with a 201/200
					} else {
						reject(response.data); 
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error'
						// 2. 'You don't have permission to edit' (forbidden
						// 3. '<element/elements> already in use!'
					}
				}
			)
		});

    /**
 	 * Deletes an item.
     */
	deleteItem = (itemInfo) =>
	new Promise((resolve, reject) => {
		axios.delete(`http://localhost:3002/${itemInfo.itemType}/${itemInfo.itemId}`, { 
			currentUserId: itemInfo.currentUserId,
			itemId: itemInfo.itemId
		})
			.then(response => {
				if (response.data) {
					resolve(response.data); // send ok msg or 200/201
					// 'Item has been successfully deleted.'
				} else {
					reject(response.data); 
					// send back the error
					// should return a msg for the error:
					// 1. server error
					// 2. you don't have permission to delete this item (forbidden)
				}
			})
	});

	/**
 	 * Adds roles to a user account.
 	 */
	addUserRole = (data) =>
	new Promise((resolve, reject) => {
		// Change the URL to the appropriate endpoint for adding roles to a user
		axios.post(`/api/user/addRole`, data)
			.then(response => {
				if (response.data.success) {
					// Resolve with a success message and appropriate status code
					resolve(response.data.message); 
					// 'User Role has been successfully added!'
				} else {
					// Reject with the error message and a consistent error code
					reject(response.data.error);
					// Potential error messages:
					// 1. 'Server error'
					// 2. 'You don't have permission to add roles' (forbidden)
					// 3. 'User Role is already in use!' (another role with the same name exist, check with/without case sensitivity)
				}
			})
	});


	/**
	 * Get items.
	 */
	getItems = (itemsInfo) =>
	new Promise((resolve, reject) => {
		axios.get(`http://localhost:3002/${itemsInfo.itemType}/all`).then(
				(
					response
				) => {
					if (response.data) {
						// resolve with a success message and 201/200 code
						resolve(response.data); // return an array of items
					} else {
						reject(response);
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error! Please try again later.'
						// 2. 'You don't have permission to get data.' (forbidden)
					}
				}
			);
	});	

	/**
	 * Get model by id.
	 */
	getIModelById = (payload) =>
	new Promise((resolve, reject) => {
			axios.post(`http://localhost:3050/api/items/getModel`, {
				modelId: payload.modelId
				}).then(
				(
					response
				) => {
					if (response.data) {
						// resolve with a success message and 201/200 code
						resolve(response); // return the target model
					} else {
						reject(response);
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error! Please try again later.'
						// 2. 'You don't have permission to get data.' (forbidden)
					}
				}
			);
	});	


	/**
	 * Get model by id.
	 */
	getModelTrackings = (payload) =>
	new Promise((resolve, reject) => {
			axios.post(`http://localhost:3050/api/items/getModelTracking`, {
				modelId: payload.modelId
				}).then(
				(
					response
				) => {
					if (response.data) {
						// resolve with a success message and 201/200 code
						resolve(response); // return an array of models
					} else {
						reject(response);
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error! Please try again later.'
						// 2. 'You don't have permission to get data.' (forbidden)
					}
				}
			);
	});


	/**
	 * Get User Roles.
	 */
	getRoles = (data) =>
	new Promise((resolve, reject) => {
		axios.get(`/api/roles`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); // return an an array of user Roles:
					/*
					 *  'Managerial Head',
	 				 *  'Production Manager',
	 				 *  'Departments Head',
	 				 *  'Factory Manager',
	 				 *  'Warehouse Manager'
					 */
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	

	/**
	 * Get Managers
	 */
	getManagers = (data) =>
	new Promise((resolve, reject) => {
		axios.get(`http://localhost:3002/auth/all-users`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); // return an array of managers
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	

	/**
	 * Get Model Data
	 */
	getModelData = (data) =>
	new Promise((resolve, reject) => {
		axios.post(`/api/modelData`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); // return an object of 4 arrays: orderIds, templateTypeIds, colors, and sizes
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	


	/**
	 * Get the current material names.
	 */
	getMaterialNames = (data) =>
	new Promise((resolve, reject) => {
		axios.get(`/api/materialNames`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); // return an array of exsting material names
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	


	/**
	 * Get the data of the report based on the data. 
	 */
	getReportData = (data) =>
	new Promise((resolve, reject) => {
		axios.post(`/api/getReportData`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); 
					// return an array of object with the following items:
					/* e.g.
					    materialName: 'Material 1',
            			internalOrdersId: 1001,
            			movementId: 5001,
            			from: 'Department A',
            			to: 'Warehouse X',
            			quantity: 120,
            			color: 'Blue',
            			date: '2020-01-15' 
					*/
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	

	/**
	 * Generate a downloadable PDF link based on the data input 
	 */
	generatePDFReport = (data) =>
	new Promise((resolve, reject) => {
		axios.post(`/api/generatePDFReport`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); 
					// return a downloadable PDF link based on the data input
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	


	/**
	 * Get the existing supplier names.
	 */
	getSupplierNames = (data) =>
	new Promise((resolve, reject) => {
		axios.post(`/api/supplierNames`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); 
					// return an array of current suppliers, like the follow:
					/*
						[
        					'Tartous Textile Solutions',
        					'Raqqa Garment Makers',
        					'Deir Ezzor Cloth Co.',
        					'Aleppo Textiles Ltd.',
        					'Damascus Fabrics Co.'
    					]
					*/ 
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	


	/**
	 * Get the existing supplier names.
	 */
	getSupplierNames = (data) =>
	new Promise((resolve, reject) => {
		axios.post(`/api/supplierNames`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); 
					// return an array of current suppliers, like the follow:
					/*
						[
							'Tartous Textile Solutions',
							'Raqqa Garment Makers',
							'Deir Ezzor Cloth Co.',
							'Aleppo Textiles Ltd.',
							'Damascus Fabrics Co.'
						]
					*/ 
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	


	/**
	 * Get existing department
	 */
	getDepartments = (data) =>
	new Promise((resolve, reject) => {
		axios.post(`/api/departments`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); 
					// return an array of current suppliers, like the follow:
					/*
    					[
    					    { id: 'departId', label: 'Design', value: 'Design' },
    					    { id: 'departId', label: 'Production', value: 'Production' },
    					    { id: 'departId', label: 'Quality Control', value: 'Quality Control' },
    					    { id: 'departId', label: 'Warehouse', value: 'Warehouse' },
    					    { id: 'departId', label: 'Human Resources', value: 'Human Resources' },
    					    { id: 'departId', label: 'Marketing', value: 'Marketing' },
    					    { id: 'departId', label: 'Sales', value: 'Sales' },
    					    { id: 'departId', label: 'Operations', value: 'Operations' },
    					    { id: 'departId', label: 'Product Management', value: 'Product Management' },
    					    { id: 'departId', label: 'Supply Chain', value: 'Supply Chain' }
    					]
					*/ 
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	


	/**
	 * Get existing departments and templates
	 */
	getDepartmentsAndTemplates = (data) =>
	new Promise((resolve, reject) => {
		axios.post(`/api/departmentsAndTemplates`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); 
					// return an object of two arrays one named templates 
					// the other, departments within which each elements has
					// an id and it's name
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	


	/**
	 * Get template size data
	 */
	getTemplateData = (data) =>
	new Promise((resolve, reject) => {
		axios.post(`/api/templateData`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); 
					// return an object of 5 arrays named: materials, 
					// templates, sizes, measurementNames, measurementUnits
					// within which each elements has
					// an id and it's name
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	

	/**
	 * get the names of existing product catalogue details
	 */
	getProductCatalogueDetails = (data) =>
	new Promise((resolve, reject) => {
		axios.post(`/api/productCatalogueDetails`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); 
					// return an array of product catalogue details
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	

	/**
	 * get the names of existing order data of the templatePatterns, the productCatalogues, and modelNames
	 */
	getOrderData = (data) =>
	new Promise((resolve, reject) => {
		axios.post(`/api/orderData`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); 
					// return an object of arrays of: templatePatterns, productCatalogues, and modelNames
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	


	/**
	* get the orders + details for the Engineering, and the manager dashboards
	*/
	getOrdersDetails = (data) =>
	new Promise((resolve, reject) => {
		axios.post(`http://localhost:3050/api/ordersDetails`, data).then(
			(
				response
			) => {
				if (response.data) {
					// resolve with 201/200 code
					resolve(response.data); 
					// return an object of arrays of orders + details (can combine both tables into one object
					// within the same array)
				} else {
					reject(response.data.error);
					// send back the error + consistent error code: 404, 401..
					// should return a msg for the error:
					// 1. 'Server error! Please try again later.'
					// 2. 'You don't have permission to get data.' (forbidden)
				}
			}
		);
	});	


	/**
	 * Signs out the user.
	 */
	logout = () => {
		_setSession(null);
		this.emit('onLogout', 'Logged out');
	};

}

/**
 * Sets the session by storing the access token in the local storage and setting the default authorization header.
 */
function _setSession(access_token) {
	if (access_token) {
		setAccessToken(access_token);
		axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	} else {
		removeAccessToken();
		delete axios.defaults.headers.common.Authorization;
	}
}

/**
 * Checks if the access token is valid.
 */
function isAuthTokenValid(access_token) {
    if (!access_token) {
        return false;
    }

    try {
        const decodedAccess = jwtDecode(access_token);
        const now = Math.floor(Date.now() / 1000);

		console.log('the ACCESSTOKEN', decodedAccess, decodedAccess.exp < now )

        const leeway = 1000; // seconds
        if (decodedAccess.exp < now - leeway) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Gets the access token from the local storage.
 */
function getAccessToken() {
	return window.localStorage.getItem('jwt_access_token');
}

/**
 * Sets the access token in the local storage.
 */
function setAccessToken(access_token) {
	return window.localStorage.setItem('jwt_access_token', access_token);
}

/**
 * Sets the userId in the local storage.
 */
function setUserId(userId) {
	return window.localStorage.setItem('userId', userId);
}

/**
 * Removes the access token from the local storage.
 */
function removeAccessToken() {
	return window.localStorage.removeItem('jwt_access_token');
}

const instance = new JwtService();

export default instance;
