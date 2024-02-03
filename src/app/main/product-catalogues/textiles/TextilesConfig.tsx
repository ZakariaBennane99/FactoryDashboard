import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'textilesPage', en);
i18next.addResourceBundle('ar', 'textilesPage', ar);

const Textiles = lazy(() => import('./Textiles'));

/**
 * The Departments page config.
 */
const TextilesConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/product-catalogues/textiles',
			element: <Textiles />
		}
	]
};

export default TextilesConfig;
