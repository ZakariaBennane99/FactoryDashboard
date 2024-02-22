import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';


i18next.addResourceBundle('en', 'ordersPage', en);
i18next.addResourceBundle('ar', 'ordersPage', ar);

const Orders = lazy(() => import('./Orders'));

/**
 * The Dashboards/Orders page config.
 */
const OrdersConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/dashboards/orders',
			element: <Orders />
		}
	]
};

export default OrdersConfig;
