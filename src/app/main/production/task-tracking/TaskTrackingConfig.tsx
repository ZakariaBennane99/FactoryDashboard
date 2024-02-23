import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'taskTrackingPage', en);
i18next.addResourceBundle('ar', 'taskTrackingPage', ar);

const TaskTracking = lazy(() => import('./TaskTracking'));

/**
 * The TaskTracking page config.
 */
const TaskTrackingConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/production-departments/task-tracking',
			element: <TaskTracking />
		}
	]
};

export default TaskTrackingConfig;
