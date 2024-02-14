import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'internalOrdersPage', en);
i18next.addResourceBundle('ar', 'internalOrdersPage', ar);

const InternalOrders = lazy(() => import('./InternalOrders'));

/**
 * The Departments page config.
 */
const InternalOrdersConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/internal-orders',
			element: <InternalOrders />
		}
	]
};

export default InternalOrdersConfig;
