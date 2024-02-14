import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'materialsPage', en);
i18next.addResourceBundle('ar', 'materialsPage', ar);

const Materials = lazy(() => import('./Materials'));

/**
 * The Departments page config.
 */
const MaterialsConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/store-processes/materials',
			element: <Materials />
		}
	]
};

export default MaterialsConfig;
