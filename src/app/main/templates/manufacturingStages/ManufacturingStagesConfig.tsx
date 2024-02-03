import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'manufacturingStagesPage', en);
i18next.addResourceBundle('ar', 'manufacturingStagesPage', ar);

const ManufacturingStages = lazy(() => import('./ManufacturingStages'));

/**
 * The Departments page config.
 */
const ManufacturingStagesConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/templates/manufacturing-stages',
			element: <ManufacturingStages />
		}
	]
};

export default ManufacturingStagesConfig;
