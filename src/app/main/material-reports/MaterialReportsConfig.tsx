import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';


i18next.addResourceBundle('en', 'MaterialReportsPage', en);
i18next.addResourceBundle('ar', 'MaterialReportsPage', ar);

const MaterialReports = lazy(() => import('./MaterialReports'));

/**
 * The Departments page config.
 */
const MaterialReportsConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/material-reports',
			element: <MaterialReports />
		}
	]
};

export default MaterialReportsConfig;
