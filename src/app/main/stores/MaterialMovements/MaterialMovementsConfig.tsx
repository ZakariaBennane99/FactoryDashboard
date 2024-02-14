import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'materialMovementsPage', en);
i18next.addResourceBundle('ar', 'materialMovementsPage', ar);

const MaterialMovements = lazy(() => import('./MaterialMovements'));

/**
 * The Departments page config.
 */
const MaterialMovementsConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/store-processes/material-movements',
			element: <MaterialMovements />
		}
	]
};

export default MaterialMovementsConfig;
