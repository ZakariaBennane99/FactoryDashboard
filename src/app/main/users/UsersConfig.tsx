import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'usersPage', en);
i18next.addResourceBundle('ar', 'usersPage', ar);

const Users = lazy(() => import('./Users'));

/**
 * The Users page config.
 */
const UsersConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'users',
			element: <Users />
		}
	]
};

export default UsersConfig;
