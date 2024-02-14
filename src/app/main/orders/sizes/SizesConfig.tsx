import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'sizesPage', en);
i18next.addResourceBundle('ar', 'sizesPage', ar);

const Sizes = lazy(() => import('./Sizes'));

/**
 * The Departments page config.
 */
const SizesConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/models/sizes',
			element: <Sizes />
		}
	]
};

export default SizesConfig;
