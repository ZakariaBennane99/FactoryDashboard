import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'colorsPage', en);
i18next.addResourceBundle('ar', 'colorsPage', ar);

const Colors = lazy(() => import('./Colors'));

/**
 * The Departments page config.
 */
const ColorsConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/orders/colors',
			element: <Colors />
		}
	]
};

export default ColorsConfig;
