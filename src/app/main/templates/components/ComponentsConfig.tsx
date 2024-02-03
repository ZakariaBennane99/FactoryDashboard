import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'componentsPage', en);
i18next.addResourceBundle('ar', 'componentsPage', ar);

const Components = lazy(() => import('./Components'));

/**
 * The Departments page config.
 */
const InternalOrdersConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/templates/components',
			element: <Components />
		}
	]
};

export default InternalOrdersConfig;
