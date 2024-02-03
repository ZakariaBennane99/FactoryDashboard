import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'categoriesIPage', en);
i18next.addResourceBundle('ar', 'categoriesIPage', ar);


const CategoriesI = lazy(() => import('./CategoriesI'));

/**
 * The Departments page config.
 */
const InternalOrdersConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/product-catalogues/categories-I',
			element: <CategoriesI />
		}
	]
};

export default InternalOrdersConfig;
