import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ECommerceApp = lazy(() => import('./ECommerceApp'));
//const Product = lazy(() => import('./product/Product'));
//const Products = lazy(() => import('./products/Products'));
//const Order = lazy(() => import('./order/Order'));

const Warehouses = lazy(() => import('../../components/stores/warehouses/Warehouses'))

/**
 * The E-Commerce app configuration.
 */
const ECommerceAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/store-management',
			element: <ECommerceApp />,
			children: [
				{
					path: '',
					element: <Navigate to="warehouses" />
				}/*,
				{
					path: 'warehouses',
					element: <Warehouses />
				},
				{
					path: 'products/:productId/*',
					element: <Product />
				},
				{
					path: 'orders',
					element: <Orders />
				},
				{
					path: 'orders/:orderId',
					element: <Order />
				}*/
			]
		}
	]
};

export default ECommerceAppConfig;
