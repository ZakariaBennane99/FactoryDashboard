import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'cataloguesPage', en);
i18next.addResourceBundle('ar', 'cataloguesPage', ar);

const Catalogues = lazy(() => import('./Catalogues'));

/**
 * The Departments page config.
 */

const CataloguesConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/product-catalogues',
			element: <Catalogues />
		}
	]
};

export default CataloguesConfig;
