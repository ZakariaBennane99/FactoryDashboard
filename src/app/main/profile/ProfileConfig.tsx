import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'profilePage', en);
i18next.addResourceBundle('ar', 'profilePage', ar);

const Profile = lazy(() => import('./Profile'));

/**
 * The Profile page config.
 */
const ProfileConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'profile',
			element: <Profile />
		}
	]
};

export default ProfileConfig;
