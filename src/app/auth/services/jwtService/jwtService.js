import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
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
            (err) => {
                if (err?.response?.status === 401 && err.config) {
                    // If there's a 401 Unauthorized response, emit an event to handle auto-logout
                    this.emit('onAutoLogout', 'Invalid session');
                }
                return Promise.reject(err);
            }
        );
    };


    /**
     * Adjusted to handle authentication state without directly accessing the token.
     */
    handleAuthentication = () => {
        // Attempt to validate the session with the backend
        axios.get('http://localhost:3002/auth/session', { withCredentials: true })
            .then(response => {
				if (response.status === 200) {
                    this.emit('onAutoLogin', true);
                } else {
                    // Session is not valid, emit an event to indicate no access token found
                    this.emit('onNoAccessToken');
					localStorage.clear()
                }
            })
            .catch((error) => {
				console.log('The response error',  error)
                // Error or session not valid, em it an event to indicate no access token found
                this.emit('onNoAccessToken');
				localStorage.clear();
            });
    };

	/**
	 * Signs in with the provided UserName and password.
	 */
	signInWithUserNameAndPassword = (userName, password) =>
		new Promise((resolve, reject) => {
			axios
				.post('http://localhost:3002/auth/login', {
					username: userName,
					password
				}, {
					withCredentials: true
				})
				.then(
					(
						response
					) => {
						// here everytihng will be returned by the backend
						if (response.data.data) {
							response.data.data.user.role = 'admin';
							console.log(response.data.data.user)
							setUserRole(response.data.data.user.userRole);
							this.emit('onLogin', response.data.data.user);
							resolve(response.data.data);
						} else {
							reject(response.data.message);
						}
					}
				);
	});

	/**
	 * Creates a new item.
	 */
	createItem = (itemInfo, headers) =>
	new Promise((resolve, reject) => {
			axios.post(`api/create/${itemInfo.itemType}`, itemInfo.data, headers).then(
				(
					response
				) => {
					if (response.data.user) {
						// resolve with a success message and 201/200 code
						resolve(response.data.user); // '<itemInfo.itemType> has been successfully created!'
					} else {
						reject(response.data.error);
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
			axios.put(`api/update/${itemInfo.itemType}`, itemInfo.data, headers).then(
				(response) => {
					if (response.data) {
						resolve(response.data); // return a ok msg with a 201/200
						// '<itemInfo.itemType> has been successfully updated!'
					} else {
						reject(response.data.error); 
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
		axios.delete(`api/delete/${itemInfo.itemType}`, { 
			currentUserId: itemInfo.currentUserId,
			itemId: itemInfo.itemId
		})
			.then(response => {
				if (response.data) {
					resolve(response.data); // send ok msg or 200/201
					// 'Item has been successfully deleted.'
				} else {
					reject(response.data.error); 
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
		axios.get(`http://localhost:3002/${itemsInfo.itemType}/all`, { withCredentials: true }).then(
				(
					response
				) => {
					console.log('THE RESPONSE', response)
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
		axios.get(`/api/managers`, data).then(
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
        axios.post('http://localhost:3002/auth/sign-out').then(() => {
			this.emit('onLogout', 'Logged out');
			localStorage.clear()
        }).catch(error => {
            console.error('Logout failed', error);
        });
    };

}

/**
 * Sets the userRole in the local storage.
 */
function setUserRole(userRole) {
	window.localStorage.setItem('userRole', userRole);
}



const instance = new JwtService();

export default instance;
