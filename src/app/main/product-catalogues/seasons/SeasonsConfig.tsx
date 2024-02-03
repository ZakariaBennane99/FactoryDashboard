import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'seasonsPage', en);
i18next.addResourceBundle('ar', 'seasonsPage', ar);

const Seasons = lazy(() => import('./Seasons'));

/**
 * The Departments page config.
 */
const InternalOrdersConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/product-catalogues/seasons',
			element: <Seasons />
		}
	]
};

export default InternalOrdersConfig;
