import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'warehousesPage', en);
i18next.addResourceBundle('ar', 'warehousesPage', ar);

const Warehouses = lazy(() => import('./Warehouses'));

/**
 * The Departments page config.
 */
const WarehousesConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/warehouses',
			element: <Warehouses />
		}
	]
};

export default WarehousesConfig;
