import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import DepartmentConfig from '../main/departments/DepartementsConfig';
import UsersConfig from '../main/users/UsersConfig';
import SuppliersConfig from '../main/stores/suppliers/SuppliersConfig';
import MaterialsConfig from '../main/stores/materials/MaterialsConfig';
import MaterialMovementsConfig from '../main/stores/MaterialMovements/MaterialMovementsConfig';
import MaterialCategoriesConfig from '../main/stores/MaterialCategories/MaterialCategoriesConfig';
import InternalOrdersConfig from '../main/stores/InternalOrders/InternalOrdersConfig';
import productCatalogues from '../main/product-catalogues/catalogues/CataloguesConfig';
import productCataloguesCategoriesI from '../main/product-catalogues/categoriesI/CategoriesIConfig';
import productCataloguesCategoriesII from '../main/product-catalogues/categoriesII/CategoriesIIConfig';
import productCataloguesDetails from '../main/product-catalogues/details/DetailsConfig';
import productCataloguesSeasons from '../main/product-catalogues/seasons/SeasonsConfig';
import productCataloguesTextiles from '../main/product-catalogues/textiles/TextilesConfig';
import templatesComponents from '../main/templates/components/ComponentsConfig';
import templatesManufacturingStages from '../main/templates/manufacturingStages/ManufacturingStagesConfig';
import templatesPatterns from '../main/templates/patterns/PatternsConfig';
import templatesSizes from '../main/templates/sizes/SizesConfig';
import templatesTypes from '../main/templates/types/TypesConfig';
import templates from '../main/templates/templates/TemplatesConfig';
import orderColors from '../main/orders/colors/ColorsConfig'
import orderSizes from '../main/orders/sizes/SizesConfig'
import orders from '../main/orders/orders/OrdersConfig'
import orderDetails from '../main/orders/orderDetails/orderDetails/OrderDetailsConfig'
import orderDetailColors from '../main/orders/orderDetails/colors/ColorsConfig'
import orderDetailSizes from '../main/orders/orderDetails/sizes/SizesConfig'
import orderDetailTemplateTypes from '../main/orders/orderDetails/templateTypes/TemplateTypesConfig'
import modelsConfig from '../main/orders/models/ModelsConfig'
import materialReportsConfig from '../main/material-reports/MaterialReportsConfig'
import taskConfig from '../main/tasks/TasksConfig'
import WarehousesConfig from '../main/stores/warehouses/WarehousesConfig';
import ProfileConfig from '../main/profile/ProfileConfig'
import DashboardModels from '../main/dashboards/models/ModelsConfig';
import DashboardOrders from '../main/dashboards/orders/OrdersConfig';




const routeConfigs: FuseRouteConfigsType = [ 
	UsersConfig, DepartmentConfig, SignOutConfig, SignInConfig, SignUpConfig,
	SuppliersConfig, MaterialsConfig, MaterialMovementsConfig,
	MaterialCategoriesConfig, InternalOrdersConfig, productCatalogues, 
	productCataloguesCategoriesI, productCataloguesCategoriesII, productCataloguesDetails,
	productCataloguesSeasons, productCataloguesTextiles, templatesComponents,
	templatesManufacturingStages, templatesPatterns, templatesSizes, templatesTypes,
	templates, orderColors, orderSizes, orders, orderDetails, orderDetailColors, 
	orderDetailSizes, orderDetailTemplateTypes, modelsConfig, materialReportsConfig,
	taskConfig, WarehousesConfig, ProfileConfig, DashboardModels, DashboardOrders
];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: "/",
		element: <Navigate to="/departments" />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: 'loading',
		element: <FuseLoading />
	},
	{
		path: '404',
		element: <Error404Page />
	},
	{
		path: '*',
		element: <Navigate to="404" />
	}
];

export default routes;
