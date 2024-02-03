import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'detailsPage', en);
i18next.addResourceBundle('ar', 'detailsPage', ar);

const Details = lazy(() => import('./Details'));

/**
 * The Departments page config.
 */
const InternalOrdersConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/product-catalogues/details',
			element: <Details />
		}
	]
};

export default InternalOrdersConfig;
