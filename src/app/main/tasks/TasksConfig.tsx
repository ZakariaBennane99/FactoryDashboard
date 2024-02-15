import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'tasksPage', en);
i18next.addResourceBundle('ar', 'tasksPage', ar);

const Tasks = lazy(() => import('./Tasks'));

/**
 * The Tasks page config.
 */
const TasksConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'tasks',
			element: <Tasks />
		}
	]
};

export default TasksConfig;
