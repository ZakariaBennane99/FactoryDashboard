import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';


i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('ar', 'navigation', ar);


const userRole = window.localStorage.getItem('userRole');


/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navs = [
	{
		id: 'engineering',
		title: 'Engineering Office',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'ENGINEERING_OFFICE',
		children: [
			{
				id: 'dashboards',
				title: 'Dashboards',
				type: 'collapse',
				icon: 'heroicons-outline:speakerphone',
				translate: 'Dashboards',
				children: [
					{
						id: 'engineering.dashboards.orders',
						title: 'Orders',
						type: 'item',
						url: 'dashboards/orders', 
						translate: 'Orders'
					},
					{
						id: 'engineering.dashboards.models',
						title: 'Models',
						translate: 'Models',
						type: 'item',
						url: 'dashboards/models'
					}
				]
			},
			{
				id: 'productCatalogues',
				title: 'Product Catalogues',
				translate: 'Product-Catalogues',
				type: 'collapse',
				icon: 'heroicons-outline:puzzle',
				url: 'product-catalogues',
				children: [
					{
						id: 'basic-properties',
						title: 'Basic Properties',
						translate: 'Basic-Propertiess',
						type: 'collapse',
						children: [
							{
								id: 'pc-productcatalogcategories-I',
								title: 'Categories I',
								translate: 'CategoriesI',
								type: 'item',
								url: 'product-catalogues/categories-I',
								end: true
							},
							{
								id: 'pc-productcatalogcategories-II',
								title: 'Categories II',
								translate: 'CategoriesII',
								type: 'item',
								url: 'product-catalogues/categories-II',
								end: true
							},
							{
								id: 'pc-productcatalogtextiles',
								title: 'Textiles',
								translate: 'Textiles',
								type: 'item',
								url: 'product-catalogues/textiles',
								end: true
							},
							{
								id: 'pc-productcatalogdetails',
								title: 'Seasons',
								translate: 'Seasons',
								type: 'item',
								url: 'product-catalogues/seasons',
								end: true
							}
						]
					},
					{
						id: 'pc-productcatalogdetails',
						title: 'Details',
						translate: 'Details',
						type: 'item',
						url: 'product-catalogues/details',
						end: true
					}
				]
			},
			{
				id: 'templates',
				title: 'Templates',
				type: 'collapse',
				icon: 'heroicons-outline:scissors',
				url: 'templates',
				translate: 'Templates',
				children: [
					{
						id: 'basic-properties',
						title: 'Basic Properties',
						translate: 'Basic-Properties',
						type: 'collapse',
						children: [
							{
								id: 't-templatepatterns',
								title: 'Patterns',
								translate: 'Patterns',
								type: 'item',
								url: 'templates/patterns',
								end: true
							},
							{
								id: 't-templatepatterns',
								title: 'Types',
								translate: 'Types',
								type: 'item',
								url: 'models/template-types',
								end: true
							}
						]
					},
					{
						id: 't-templatesizes',
						title: 'Template Sizes',
						translate: 'Template-Sizes',
						type: 'item',
						url: 'templates/sizes',
						end: true
					},
					{
						id: 't-templatepatterns',
						title: 'Manufacturing Stages',
						translate: 'Manufacturing-Stages',
						type: 'item',
						url: 'templates/manufacturing-stages',
						end: true
					}
				]
			},
			{
				id: 'orders',
				title: 'Orders',
				type: 'collapse',
				icon: 'heroicons-outline:ticket',
				url: 'orders',
				translate: 'Orders',
				children: [
					{
						id: 't-templatepatterns',
						title: 'Order Details',
						translate: 'Order-Details',
						type: 'item',
						url: 'orders/details'
					}
				]
			},
			{
				id: 'models',
				title: 'Models',
				type: 'collapse',
				icon: 'heroicons-outline:tag',
				url: 'models',
				translate: 'Models',
				children: [
					{
						id: 't-templatepatterns',
						title: 'Sizes',
						translate: 'Sizes',
						type: 'item',
						url: 'models/sizes',
						end: true
					},
					{
						id: 't-templatepatterns',
						title: 'Colors',
						translate: 'Colors',
						type: 'item',
						url: 'models/colors',
						end: true
					},
				]
			},
			{
				id: 'actions',
				title: 'Actions',
				type: 'collapse',
				icon: 'heroicons-outline:switch-horizontal',
				translate: 'Actions',
				children: [
					{
						id: 'cf-iorders',
						title: 'Internal Orders',
						type: 'item',
						url: 'internal-orders',
						translate: 'Internal-Orders',
						end: true
					},
					{
						id: 'cf-iorders',
						title: 'Tasks',
						type: 'item',
						url: 'tasks',
						translate: 'Tasks',
						end: true
					},
					{
						id: 'cf-iorders',
						title: 'Material Reports',
						translate: 'Material-Reports',
						type: 'item',
						url: 'material-reports',
						end: true
					}
				]
			}
		],
	},
	{
		id: 'store.manager',
		title: 'store manager',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'Store',
		children: [
			{
				id: 'storeManagement',
				title: 'Store Management',
				translate: 'Store-Management',
				type: 'collapse',
				icon: 'heroicons-outline:color-swatch',
				children: [
					{
						id: 'cf-suppliers',
						title: 'Suppliers',
						translate: 'Suppliers',
						type: 'item',
						url: '/store-management/suppliers',
						end: true
					},
					{
						id: 'cf-materialCategories',
						title: 'Material Categories',
						translate: 'Material-Categories',
						type: 'item',
						url: '/store-management/material-categories',
						end: true
					}
				]
			},
			{
				id: 'storeProcesses',
				title: 'Store Processes',
				translate: 'Store-Processes',
				type: 'collapse',
				icon: 'heroicons-outline:switch-vertical',
				children: [
					{
						id: 'cf-materials',
						title: 'Materials',
						translate: 'Materials',
						type: 'item',
						url: '/store-processes/materials',
						end: true
					},
					{
						id: 'cf-materialmovements',
						title: 'Material Movements',
						translate: 'Material-Movements',
						type: 'item',
						url: '/store-processes/material-movements',
						end: true
					}
				]
			},
			{
				id: 'cf-iorders',
				title: 'Material Reports',
				translate: 'Material-Reports',
				type: 'item',
				url: 'material-reports',
				icon: 'heroicons-outline:document-text',
				end: true
			}
		],
	},
	{
		id: 'factory.manager',
		title: 'Factory Manager',
		translate: 'Factory-Manager',
		type: 'group',
		icon: 'heroicons-outline:home',
		children: [
			{
				id: 'manager.dashboards.orders',
				title: 'Dashboards',
				type: 'collapse',
				icon: 'heroicons-outline:speakerphone',
				translate: 'Dashboards',
				children: [
					{
						id: 'manager.dashboards.orders',
						title: 'Orders',
						translate: 'Orders',
						type: 'item',
						url: 'dashboards/orders'
					},
					{
						id: 'dashboards.models',
						title: 'Models',
						translate: 'Models',
						type: 'item',
						url: 'dashboards/models'
					}
				]
			},
			{
				id: 'users',
				title: 'Users',
				translate: 'Users',
				type: 'item',
				icon: 'heroicons-outline:user-group',
				url: '/users'
			},
			{
				id: 'departments',
				title: 'Departments',
				translate: 'Departments',
				type: 'item',
				icon: 'heroicons-outline:office-building',
				url: '/departments'
			},
			{
				id: 'cf-warehouses',
				title: 'Warehouses',
				translate: 'Warehouses',
				type: 'item',
				icon: 'heroicons-outline:cube',
				url: '/warehouses',
			},
			{
				id: 'actions',
				title: 'Actions',
				type: 'collapse',
				icon: 'heroicons-outline:switch-horizontal',
				translate: 'Actions',
				children: [
					{
						id: 'cf-iorders',
						title: 'Tasks',
						translate: 'Tasks',
						type: 'item',
						url: 'tasks',
						end: true
					}
				]
			}
		],
	},
	{
		id: 'production',
		title: 'Production Department',
		translate: 'Production-Department',
		type: 'group',
		icon: 'heroicons-outline:home',
		children: [
			{
				id: 'task.tracking',
				title: 'Task Tracking',
				translate: 'Task-Tracking',
				type: 'item',
				icon: 'heroicons-outline:check-circle',
				url: '/production-departments/task-tracking'
			},
			{
				id: 'assignments',
				title: 'Assignments',
				translate: 'Assignments',
				type: 'item',
				icon: 'heroicons-outline:clipboard-list',
				url: '/production-departments/assignments'
			}
		],
	}
];




const navigationConfig = navs.filter(nav => {

	if (userRole === 'FACTORYMANAGER') {
	  return nav.id === 'factory.manager';
	} else if (userRole === 'WAREHOUSEMANAGER') {
	  return nav.id === 'store.manager';
	} else if (userRole === 'ENGINEERING') {
	  return nav.id === 'engineering';
	} else {
	  return nav.id === 'production';
	} 
});


export default navigationConfig;