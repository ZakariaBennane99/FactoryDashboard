import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'orderDetailsPage', en);
i18next.addResourceBundle('ar', 'orderDetailsPage', ar);

const OrderDetails = lazy(() => import('./OrderDetails'));

/**
 * The Departments page config.
 */
const OrderDetailsConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/orders/details',
			element: <OrderDetails />
		}
	]
};

export default OrderDetailsConfig;
