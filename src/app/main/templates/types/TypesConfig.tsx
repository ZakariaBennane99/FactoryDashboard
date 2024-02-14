import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'typesPage', en);
i18next.addResourceBundle('ar', 'typesPage', ar);

const Types = lazy(() => import('./Types'));

/**
 * The Departments page config.
 */
const TypesConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/models/template-types',
			element: <Types />
		}
	]
};

export default TypesConfig;
