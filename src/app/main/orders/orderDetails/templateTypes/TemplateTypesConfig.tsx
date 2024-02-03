import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'templateTypesPage', en);
i18next.addResourceBundle('ar', 'templateTypesPage', ar);

const TemplateTypes = lazy(() => import('./TemplateTypes'));

/**
 * The Departments page config.
 */
const TemplateTypesConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/orders/details/template-types',
			element: <TemplateTypes />
		}
	]
};

export default TemplateTypesConfig;
