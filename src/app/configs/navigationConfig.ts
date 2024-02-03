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
				id: 'productCatalogues',
				title: 'ProductCatalogue',
				type: 'collapse',
				icon: 'heroicons-outline:puzzle',
				url: 'product-catalogues',
				translate: 'Product-Catalogues',
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
						title: 'Details',
						type: 'item',
						url: 'product-catalogues/details',
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
				id: 'templates',
				title: 'Templates',
				type: 'collapse',
				icon: 'heroicons-outline:scissors',
				url: 'templates',
				translate: 'Templates',
				children: [
					{
						id: 't-templatepatterns',
						title: 'Manufacturing Stages',
						type: 'item',
						url: 'templates/manufacturing-stages',
						end: true
					},
					{
						id: 't-templatepatterns',
						title: 'Components',
						type: 'item',
						url: 'templates/components',
						end: true
					},
					{
						id: 't-templatepatterns',
						title: 'Patterns',
						type: 'item',
						url: 'templates/patterns',
						end: true
					},
					{
						id: 't-templatetypes',
						title: 'Types',
						type: 'item',
						url: 'templates/types',
						end: true
					},					
					{
						id: 't-templatesizes',
						title: 'Sizes',
						type: 'item',
						url: 'templates/sizes',
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
						title: 'Details',
						type: 'collapse',
						url: 'orders/details',
						end: true,
						children: [
							{
								id: 't-templatepatterns',
								title: 'Template Types',
								type: 'item',
								url: 'orders/details/template-types',
								end: true
							},
							{
								id: 't-templatepatterns',
								title: 'Colors',
								type: 'item',
								url: 'orders/details/colors',
								end: true
							},
							{
								id: 't-templatepatterns',
								title: 'Sizes',
								type: 'item',
								url: 'orders/details/sizes',
								end: true
							},
						]
					},
					{
						id: 't-templatepatterns',
						title: 'Colors',
						type: 'item',
						url: 'orders/colors',
						end: true
					},					
					{
						id: 't-templatesizes',
						title: 'Sizes',
						type: 'item',
						url: 'orders/sizes',
						end: true
					}
				]
			}
		]
	},

];

export default navigationConfig;