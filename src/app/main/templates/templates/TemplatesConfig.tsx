import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'templatesPage', en);
i18next.addResourceBundle('ar', 'templatesPage', ar);

const Templates = lazy(() => import('./Templates'));

/**
 * The Departments page config.
 */
const InternalOrdersConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/templates',
			element: <Templates />
		}
	]
};

export default InternalOrdersConfig;
