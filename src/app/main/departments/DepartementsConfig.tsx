import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'departmentsPage', en);
i18next.addResourceBundle('ar', 'departmentsPage', ar);

const Departments = lazy(() => import('./Departments'));

/**
 * The Departments page config.
 */
const DepartmentsConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'departments',
			element: <Departments />
		}
	]
};

export default DepartmentsConfig;
