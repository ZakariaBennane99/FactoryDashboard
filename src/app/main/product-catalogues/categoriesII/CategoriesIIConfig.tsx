import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'categoriesIIPage', en);
i18next.addResourceBundle('ar', 'categoriesIIPage', ar);

const CategoriesII = lazy(() => import('./CategoriesII'));

/**
 * The Categories II page config.
 */
const CategoriesIIConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/product-catalogues/categories-II',
			element: <CategoriesII />
		}
	]
};

export default CategoriesIIConfig;
