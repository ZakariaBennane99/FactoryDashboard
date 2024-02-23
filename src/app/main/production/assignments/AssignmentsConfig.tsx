import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'assignmentsPage', en);
i18next.addResourceBundle('ar', 'assignmentsPage', ar);

const Assignments = lazy(() => import('./Assignments'));

/**
 * The Assignments page config.
 */
const AssignmentsConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/production-departments/assignments',
			element: <Assignments />
		}
	]
};

export default AssignmentsConfig;
