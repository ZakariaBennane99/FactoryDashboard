import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'modelsPage', en);
i18next.addResourceBundle('ar', 'modelsPage', ar);

const Models = lazy(() => import('./Models'));

/*
 *  The Departments page config.
 */

const ModelsConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/models',
			element: <Models />
		}
	]
};

export default ModelsConfig;
