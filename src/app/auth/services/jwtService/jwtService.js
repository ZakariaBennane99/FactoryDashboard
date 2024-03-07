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
						localStorage.clear();
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
			localStorage.clear();
			return;
		}

		if (isAuthTokenValid(access_token)) {
			_setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			_setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
			localStorage.clear();
		}
	};

	/**
	 * Signs in with the provided UserName and password.
	 */
	signInWithEmailAndPassword = (userName, password) => {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`http://localhost:3002/auth/login`, {
					username: userName,
					password
				});
	
				if (response.data.data.user) {
					setUserRole(response.data.data.user.userRole);
					_setSession(response.data.data.access_token);
					this.emit('onLogin', response.data.data.user);
					resolve(response.data.data.user);
				} else {
					reject(new Error(response.data.data.message));
				}
			} catch (error) {
				reject(error);
			}
		});
	};

	/**
	 * Signs in with the provided token.
	 */
	signInWithToken = () =>
    new Promise((resolve, reject) => {
        const accessToken = getAccessToken();
        if (!accessToken) {
            this.logout();
            reject(new Error('No token provided. Please log in!'));
			localStorage.clear();
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
                    // Assuming the successful response doesn't necessarily return user data anymore,
                    // but just validates the session. You might need to adjust this part based on your actual response structure.
                    resolve(response.data.user);
                } else {
                    // This block might not be necessary if your axios setup rejects non-2xx statuses,
                    // but it's here to illustrate handling different responses.
                    this.logout();
                    reject(new Error(response.data.message || 'Failed to validate session.'));
					localStorage.clear();
                }
            })
            .catch((error) => {
                // This will catch network errors and any status codes that fall outside the 2xx range.
                this.logout();
                const message = error.response ? error.response.data.message : 'Failed to login with token.';
				localStorage.clear();
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
					try {
						if (response.data) {
							// resolve with a success message and 201 code
							resolve(response.data); 
						} else {
							reject(response.data);
							// send back the error + consistent error code: 404, 401..
							// should return a msg for the error:
							// 1. 'Server error'
							// 2. 'You don't have permission to edit' (forbidden)
							// 3. '<element/elements> is/are already in use!'
						}
					} catch (err) {
						reject(err)
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
					try {
						if (response.data) {
							// resolve with a success message and 201 code
							resolve(response.data); 
						} else {
							reject(response.data);
							// send back the error + consistent error code: 404, 401..
							// should return a msg for the error:
							// 1. 'Server error'
							// 2. 'You don't have permission to edit' (forbidden)
							// 3. '<element/elements> is/are already in use!'
						}
					} catch (err) {
						reject(err)
					}
				}
			)
	});

	/**
	 * Updates an item.
	 */
	updateToProg = (itemInfo, headers) =>
	new Promise((resolve, reject) => {
		axios.get(`http://localhost:3002/trackingmodels/prog/${itemInfo.itemId}`, headers).then(
			(response) => {
				try {
					if (response.data) {
						// resolve with a success message and 201 code
						resolve(response.data); 
					} else {
						reject(response.data);
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error'
						// 2. 'You don't have permission to edit' (forbidden)
						// 3. '<element/elements> is/are already in use!'
					}
				} catch (err) {
					reject(err)
				}
			}
		)
	});

	getItemNames = (itemUrls) =>
    new Promise((resolve, reject) => {
        // Map each URL to a request that axios will execute
        const requests = itemUrls.map(url => axios.get(`http://localhost:3002/${url}`));

        // Use Promise.all to execute all requests concurrently
        Promise.all(requests)
            .then(responses => {
                // responses is an array of axios responses
                // You can process these responses further if needed
                const data = responses.map(response => response.data);
                resolve(data);
            })
            .catch(error => {
                // If any request fails, this catch block will execute
                reject(error);
            });
    });


    /**
 	 * Deletes an item.
     */
	deleteItem = (itemInfo) =>
	new Promise((resolve, reject) => {
		axios.delete(`http://localhost:3002/${itemInfo.itemType}/${itemInfo.itemId}`)
			.then(response => {
				try {
					if (response.data) {
						// resolve with a success message and 201 code
						resolve(response.data); 
					} else {
						reject(response.data);
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error'
						// 2. 'You don't have permission to edit' (forbidden)
						// 3. '<element/elements> is/are already in use!'
					}
				} catch (err) {
					reject(err)
				}
			})
	});

	/**
 	 * reports
 	 */
	handleReports = (itemInfo) =>
	new Promise((resolve, reject) => {

		const config = {
            headers: {
				'Content-Type': 'application/json'
			}
        };
        
		if (itemInfo.itemType.includes('download')) {
			config.responseType = 'blob';
			config.headers['Accept'] = 'application/pdf';
		}

		axios.post(`http://localhost:3002/reports/${itemInfo.itemType}`, itemInfo.data, config)
			.then(response => {
				if (response.data) {
					// Resolve with a success message and appropriate status code
					resolve(response.data); 
					// 'User Role has been successfully added!'
				} else {
					// Reject with the error message and a consistent error code
					reject(response.data);
				}
			})
	});


	/**
	 * Get items.
	 */
	getItems = (itemsInfo) =>
	new Promise((resolve, reject) => {

		const config = {
            headers: {
                'Page': itemsInfo.page,
                'Items-Per-Page': itemsInfo.itemsPerPage
            }
        };

		axios.get(`http://localhost:3002/${itemsInfo.itemType}/all`, config).then(
				(
					response
				) => {
					try {
						if (response.data) {
							// resolve with a success message and 201 code
							resolve(response.data); 
						} else {
							reject(response.data);
							// send back the error + consistent error code: 404, 401..
							// should return a msg for the error:
							// 1. 'Server error'
							// 2. 'You don't have permission to edit' (forbidden)
							// 3. '<element/elements> is/are already in use!'
						}
					} catch (err) {
						reject(err)
					}
				}
			);
	});	

	/**
	 * Get model by id.
	 */
	getItemById = (payload) =>
	new Promise((resolve, reject) => {
			axios.get(`http://localhost:3002/${payload.itemType}/${payload.itemId}`).then(
				(
					response
				) => {
					try {
						if (response.data) {
							// resolve with a success message and 201 code
							resolve(response.data); 
						} else {
							reject(response.data);
							// send back the error + consistent error code: 404, 401..
							// should return a msg for the error:
							// 1. 'Server error'
							// 2. 'You don't have permission to edit' (forbidden)
							// 3. '<element/elements> is/are already in use!'
						}
					} catch (err) {
						reject(err)
					}
				}
			);
	});	


   	/**
    * Get model by id.
    */
   	getOrdersForDash = () =>
   	new Promise((resolve, reject) => {
   			axios.get(`http://localhost:3002/order/ordersForDash`).then(
   				(
   					response
   				) => {
   					try {
   						if (response.data) {
   							// resolve with a success message and 201 code
   							resolve(response.data); 
   						} else {
   							reject(response.data);
   							// send back the error + consistent error code: 404, 401..
   							// should return a msg for the error:
   							// 1. 'Server error'
   							// 2. 'You don't have permission to edit' (forbidden)
   							// 3. '<element/elements> is/are already in use!'
   						}
   					} catch (err) {
   						reject(err)
   					}
   				}
   			);
   	});	


	/**
    * Get model by id.
    */
    getProdModels = () =>
    new Promise((resolve, reject) => {
 		   axios.get(`http://localhost:3002/model/productionModels`).then(
 			   (
 				   response
 			   ) => {
 				   try {
 					   if (response.data) {
 						   // resolve with a success message and 201 code
 						   resolve(response.data); 
 					   } else {
 						   reject(response.data);
 						   // send back the error + consistent error code: 404, 401..
 						   // should return a msg for the error:
 						   // 1. 'Server error'
 						   // 2. 'You don't have permission to edit' (forbidden)
 						   // 3. '<element/elements> is/are already in use!'
 					   }
 				   } catch (err) {
 					   reject(err)
 				   }
 			   }
 		   );
    });	


	/**
	 * Get model by id.
	get */
	ModelTrackings = (payload) =>
	new Promise((resolve, reject) => {
			axios.post(`http://localhost:3050/api/items/getModelTracking`, {
				modelId: payload.modelId
				}).then(
				(
					response
				) => {
					try {
						if (response.data) {
							// resolve with a success message and 201 code
							resolve(response.data); 
						} else {
							reject(response.data);
							// send back the error + consistent error code: 404, 401..
							// should return a msg for the error:
							// 1. 'Server error'
							// 2. 'You don't have permission to edit' (forbidden)
							// 3. '<element/elements> is/are already in use!'
						}
					} catch (err) {
						reject(err)
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
				try {
					if (response.data) {
						// resolve with a success message and 201 code
						resolve(response.data); 
					} else {
						reject(response.data);
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error'
						// 2. 'You don't have permission to edit' (forbidden)
						// 3. '<element/elements> is/are already in use!'
					}
				} catch (err) {
					reject(err)
				}
			}
		);
	});	

	/**
	 * Get Managers
	 */
	getManagers = (data) =>
	new Promise((resolve, reject) => {
		axios.get(`http://localhost:3002/auth/managers`, data).then(
			(
				response
			) => {
				try {
					if (response.data) {
						// resolve with a success message and 201 code
						resolve(response.data); 
					} else {
						reject(response.data);
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error'
						// 2. 'You don't have permission to edit' (forbidden)
						// 3. '<element/elements> is/are already in use!'
					}
				} catch (err) {
					reject(err)
				}
			}
		);
	});	

	/**
	 * Search queries
	 */
	searchItems = (data) =>
	new Promise((resolve, reject) => {
		const appends = data.from ? "?from=" + data.from + "&to=" + data.to : ''
		axios.get(`http://localhost:3002/${data.itemType}/search/${data.query}${appends}`).then(
			(
				response
			) => {
				try {
					if (response.data) {
						// resolve with a success message and 201 code
						resolve(response.data); 
					} else {
						reject(response.data);
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error'
						// 2. 'You don't have permission to edit' (forbidden)
						// 3. '<element/elements> is/are already in use!'
					}
				} catch (err) {
					reject(err)
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
				try {
					if (response.data) {
						// resolve with a success message and 201 code
						resolve(response.data); 
					} else {
						reject(response.data);
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error'
						// 2. 'You don't have permission to edit' (forbidden)
						// 3. '<element/elements> is/are already in use!'
					}
				} catch (err) {
					reject(err)
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
				try {
					if (response.data) {
						// resolve with a success message and 201 code
						resolve(response.data); 
					} else {
						reject(response.data);
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error'
						// 2. 'You don't have permission to edit' (forbidden)
						// 3. '<element/elements> is/are already in use!'
					}
				} catch (err) {
					reject(err)
				}
			}
		);
	});	


	/**
	 * Get the report based on the data. 
	 */
	getReportData = (data) =>
	new Promise((resolve, reject) => {
		axios.post(`http://localhost:3050/reports/getModelTracking`, data).then(
			(
				response
			) => {
				try {
					if (response.data) {
						// resolve with a success message and 201 code
						resolve(response.data); 
					} else {
						reject(response.data);
						// send back the error + consistent error code: 404, 401..
						// should return a msg for the error:
						// 1. 'Server error'
						// 2. 'You don't have permission to edit' (forbidden)
						// 3. '<element/elements> is/are already in use!'
					}
				} catch (err) {
					reject(err)
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
		localStorage.clear();
		this.emit('onLogout', 'Logged out');
	};

}

/**
 * Sets the userRole in the local storage.
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

function setUserRole(userRole) {
	return window.localStorage.setItem('userRole', userRole);
}

/**
 * Removes the access token from the local storage.
 */
function removeAccessToken() {
	return window.localStorage.removeItem('jwt_access_token');
}

const instance = new JwtService();

export default instance;
