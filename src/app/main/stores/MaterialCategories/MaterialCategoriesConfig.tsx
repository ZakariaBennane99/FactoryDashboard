import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'materialCategoriesPage', en);
i18next.addResourceBundle('ar', 'materialCategoriesPage', ar);

const MaterialCategories = lazy(() => import('./MaterialCategories'));

/**
 * The Departments page config.
 */

const MaterialCategoriesConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/stores/material-categories',
			element: <MaterialCategories />
		}
	]
};

export default MaterialCategoriesConfig;
