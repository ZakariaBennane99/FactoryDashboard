import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'patternsPage', en);
i18next.addResourceBundle('ar', 'patternsPage', ar);

const Patterns = lazy(() => import('./Patterns'));

/**
 * The Departments page config.
 */
const PatternsConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/templates/patterns',
			element: <Patterns />
		}
	]
};

export default PatternsConfig;
