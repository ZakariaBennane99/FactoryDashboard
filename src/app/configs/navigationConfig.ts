import i18next from 'i18next';
import { FuseNavigationType } from '@fuse/core/FuseNavigation/types/FuseNavigationType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavigationType = [
	{
		id: 'engineeringOffice',
		title: 'Engineering Office',
		type: 'group',
		icon: 'heroicons-outline:home',
		children: [
			{
				id: 'dashboards',
				title: 'dashboards',
				type: 'collapse',
				icon: 'heroicons-outline:speakerphone',
				url: 'dashboards',
				translate: 'Dashboards',
				children: [
					{
						id: 'engineering.dashboards.orders',
						title: 'Orders',
						type: 'item',
						url: 'dashboards/orders'
					},
					{
						id: 'engineering.dashboards.models',
						title: 'Models',
						type: 'item',
						url: 'dashboards/models'
					}
				]
			},
			{
				id: 'productCatalogues',
				title: 'Product Catalogues',
				type: 'collapse',
				icon: 'heroicons-outline:puzzle',
				url: 'product-catalogues',
				children: [
					{
						id: 'basic-properties',
						title: 'Basic Properties',
						type: 'collapse',
						children: [
							{
								id: 'pc-productcatalogcategories-I',
								title: 'Categories I',
								type: 'item',
								url: 'product-catalogues/categories-I',
								end: true
							},
							{
								id: 'pc-productcatalogcategories-II',
								title: 'Categories II',
								type: 'item',
								url: 'product-catalogues/categories-II',
								end: true
							},
							{
								id: 'pc-productcatalogtextiles',
								title: 'Textiles',
								type: 'item',
								url: 'product-catalogues/textiles',
								end: true
							},
							{
								id: 'pc-productcatalogdetails',
								title: 'Seasons',
								type: 'item',
								url: 'product-catalogues/seasons',
								end: true
							}
						]
					},
					{
						id: 'pc-productcatalogdetails',
						title: 'Details',
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
						type: 'collapse',
						children: [
							{
								id: 't-templatepatterns',
								title: 'Patterns',
								type: 'item',
								url: 'templates/patterns',
								end: true
							},
							{
								id: 't-templatepatterns',
								title: 'Types',
								type: 'item',
								url: 'models/template-types',
								end: true
							}
						]
					},
					{
						id: 't-templatesizes',
						title: 'Template Sizes',
						type: 'item',
						url: 'templates/sizes',
						end: true
					},
					{
						id: 't-templatepatterns',
						title: 'Manufacturing Stages',
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
						type: 'item',
						url: 'models/sizes',
						end: true
					},
					{
						id: 't-templatepatterns',
						title: 'Colors',
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
						end: true
					},
					{
						id: 'cf-iorders',
						title: 'Tasks',
						type: 'item',
						url: 'tasks',
						end: true
					},
					{
						id: 'cf-iorders',
						title: 'Feedback',
						type: 'item',
						url: 'feedback',
						end: true
					},
					{
						id: 'cf-iorders',
						title: 'Material Reports',
						type: 'item',
						url: 'material-reports',
						end: true
					}
				]
			}
		],
	},
	{
		id: 'store',
		title: 'store',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'STORE',
		children: [
			{
				id: 'storeManagement',
				title: 'Store Management',
				type: 'collapse',
				icon: 'heroicons-outline:color-swatch',
				children: [
					{
						id: 'cf-warehouses',
						title: 'Warehouses',
						type: 'item',
						url: '/store-management/warehouses',
						end: true
					},
					{
						id: 'cf-suppliers',
						title: 'Suppliers',
						type: 'item',
						url: '/store-management/suppliers',
						end: true
					},
					{
						id: 'cf-materialCategories',
						title: 'Material Categories',
						type: 'item',
						url: '/store-management/material-categories',
						end: true
					}
				]
			},
			{
				id: 'storeProcesses',
				title: 'Store Processes',
				type: 'collapse',
				icon: 'heroicons-outline:switch-vertical',
				children: [
					{
						id: 'cf-materials',
						title: 'Materials',
						type: 'item',
						url: '/store-processes/materials',
						end: true
					},
					{
						id: 'cf-materialmovements',
						title: 'Material Movements',
						type: 'item',
						url: '/store-processes/material-movements',
						end: true
					}
				]
			},
			{
				id: 'cf-iorders',
				title: 'Material Reports',
				type: 'item',
				url: 'material-reports',
				icon: 'heroicons-outline:document-text',
				end: true
			}
		],
	},
	{
		id: 'manager',
		title: 'manager',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'MANAGER',
		children: [
			{
				id: 'manager.dashboards.orders',
				title: 'Dashboards',
				type: 'collapse',
				icon: 'heroicons-outline:speakerphone',
				url: 'dashboards',
				translate: 'Dashboards',
				children: [
					{
						id: 'manager.dashboards.orders',
						title: 'Orders',
						type: 'item',
						url: 'dashboards/orders'
					},
					{
						id: 'dashboards.models',
						title: 'Models',
						type: 'item',
						url: 'dashboards/models'
					}
				]
			},
			{
				id: 'users',
				title: 'Users',
				type: 'item',
				icon: 'heroicons-outline:user-group',
				url: '/users',
				translate: 'Users'
			},
			{
				id: 'departments',
				title: 'Departments',
				type: 'item',
				icon: 'heroicons-outline:office-building',
				url: '/departments',
				translate: 'Departments'
			},
			{
				id: 'actions',
				title: 'Actions',
				type: 'collapse',
				icon: 'heroicons-outline:switch-horizontal',
				url: '/actions',
				translate: 'Actions',
				children: [
					{
						id: 'cf-iorders',
						title: 'Tasks',
						type: 'item',
						url: 'tasks',
						end: true
					},
					{
						id: 'cf-iorders',
						title: 'Feedbacks',
						type: 'item',
						url: 'feedbacks',
						end: true
					},
				]
			}
		],
	}
];

export default navigationConfig;