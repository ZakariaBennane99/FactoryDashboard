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
		id: 'dashboard',
		title: 'dashboard',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'DASHBOARD',
		children: [

			{
				id: 'departments',
				title: 'Departments',
				type: 'item',
				icon: 'heroicons-outline:office-building',
				url: '/departments',
				translate: 'Departments'
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
				id: 'stores',
				title: 'Stores',
				type: 'collapse',
				icon: 'heroicons-outline:color-swatch',
				translate: 'Stores',
				children: [
					{
						id: 'cf-warehouses',
						title: 'Warehouses',
						type: 'item',
						url: '/stores/warehouses',
						end: true
					},
					{
						id: 'cf-suppliers',
						title: 'Suppliers',
						type: 'item',
						url: '/stores/suppliers',
						end: true
					},
					{
						id: 'cf-materials',
						title: 'Materials',
						type: 'item',
						url: '/stores/materials',
						end: true
					},
					{
						id: 'cf-materialCategories',
						title: 'Material Categories',
						type: 'item',
						url: '/stores/material-categories',
						end: true
					},
					{
						id: 'cf-iorders',
						title: 'Internal Orders',
						type: 'item',
						url: '/stores/internal-orders',
						end: true
					},
					{
						id: 'cf-materialmovements',
						title: 'Material Movements',
						type: 'item',
						url: '/stores/material-movements',
						end: true
					}
				]
			},
			{
				id: 'productCatalogue',
				title: 'ProductCatalogue',
				type: 'collapse',
				icon: 'heroicons-outline:puzzle',
				url: '/apps/productcatalog',
				translate: 'Product-Catalogue',
				children: [
					{
						id: 'pc-productcatalogcategories1',
						title: 'Product Catalog Categories 1',
						type: 'item',
						url: 'apps/catalogApp/productcatalogcategories1',
						end: true
					},
					{
						id: 'pc-productcatalogcategories2',
						title: 'Product Catalog Categories 2',
						type: 'item',
						url: 'apps/catalogApp/productcatalogcategories2',
						end: true
					},
					{
						id: 'pc-productcatalog',
						title: 'Product Catalog',
						type: 'item',
						url: 'apps/catalogApp/productcatalogs',
						end: true
					},
					{
						id: 'pc-productcatalogtextiles',
						title: 'Product Catalog Textiles',
						type: 'item',
						url: 'apps/catalogApp/productcatalogtextiles',
						end: true
					},
					{
						id: 'pc-productcatalogdetails',
						title: 'Product Catalog Details',
						type: 'item',
						url: 'apps/catalogApp/productcatalogdetails',
						end: true
					}
				]
			},
			{
				id: 'templates',
				title: 'Templates',
				type: 'collapse',
				icon: 'heroicons-outline:scissors',
				url: '/apps/template',
				translate: 'Template',
				children: [
					{
						id: 't-templatesizes',
						title: 'Template Sizes',
						type: 'item',
						url: 'apps/storeApp/templatesizes',
						end: true
					},
					{
						id: 't-templatetypes',
						title: 'Template Types',
						type: 'item',
						url: 'apps/storeApp/templatetypes',
						end: true
					},
					{
						id: 't-templatepatterns',
						title: 'Template Patterns',
						type: 'item',
						url: 'apps/storeApp/templatepatterns',
						end: true
					},
					{
						id: 't-templates',
						title: 'Templates',
						type: 'item',
						url: 'apps/storeApp/templates',
						end: true
					},
				
				]
			},
			{
				id: 'apps.orders',
				title: 'Orders',
				type: 'item',
				icon: 'heroicons-outline:ticket',
				url: '/apps/Orders',
				translate: 'Orders'
			},
			{
				id: 'apps.product',
				title: 'Product',
				type: 'item',
				icon: 'heroicons-outline:wrench',
				url: '/apps/product',
				translate: 'Product'
			},
		]
	},

];

export default navigationConfig;