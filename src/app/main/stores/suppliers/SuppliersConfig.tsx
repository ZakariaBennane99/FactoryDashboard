import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'suppliersPage', en);
i18next.addResourceBundle('ar', 'suppliersPage', ar);

const Suppliers = lazy(() => import('./Suppliers'));

/**
 * The Departments page config.
 */
const SuppliersConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/store-management/suppliers',
			element: <Suppliers />
		}
	]
};

export default SuppliersConfig;
