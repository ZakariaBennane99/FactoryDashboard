import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { selectUserRole } from 'app/store/user/userSlice';
import FuseNavigationHelper from '@fuse/utils/FuseNavigationHelper';
import i18next from 'i18next';
import FuseNavItemModel from '@fuse/core/FuseNavigation/models/FuseNavItemModel';
import FuseUtils from '@fuse/utils';
import navigationConfig from 'app/configs/navigationConfig';
import { selectCurrentLanguageId } from '../i18nSlice';

const navigationAdapter = createEntityAdapter();

const emptyInitialState = navigationAdapter.getInitialState([]);

const initialState = navigationAdapter.upsertMany(emptyInitialState, navigationConfig);

/**
 * Redux Thunk actions related to the navigation store state
 */

/**
 * Appends a navigation item to the navigation store state.
 */
export const appendNavigationItem =
	(item, parentId = null) =>
	async (dispatch, getState) => {
		const AppState = getState();
		const navigation = selectNavigationAll(AppState);

		dispatch(setNavigation(FuseNavigationHelper.appendNavItem(navigation, FuseNavItemModel(item), parentId)));

		return Promise.resolve();
	};

/**
 * Prepends a navigation item to the navigation store state.
 */
export const prependNavigationItem =
	(item, parentId = null) =>
	async (dispatch, getState) => {
		const AppState = getState();
		const navigation = selectNavigationAll(AppState);

		dispatch(setNavigation(FuseNavigationHelper.prependNavItem(navigation, FuseNavItemModel(item), parentId)));

		return Promise.resolve();
	};

/**
 * Adds a navigation item to the navigation store state at the specified index.
 */
export const updateNavigationItem =
	(id, item) =>
	async (dispatch, getState) => {
		const AppState = getState();
		const navigation = selectNavigationAll(AppState);

		dispatch(setNavigation(FuseNavigationHelper.updateNavItem(navigation, id, item)));

		return Promise.resolve();
	};

/**
 * Removes a navigation item from the navigation store state.
 */
export const removeNavigationItem =
	(id) =>
	async (dispatch, getState) => {
		const AppState = getState();
		const navigation = selectNavigationAll(AppState);

		dispatch(setNavigation(FuseNavigationHelper.removeNavItem(navigation, id)));

		return Promise.resolve();
	};

export const {
	selectAll: selectNavigationAll,
	selectIds: selectNavigationIds,
	selectById: selectNavigationItemById
} = navigationAdapter.getSelectors((state) => state.fuse.navigation);

/**
 * The navigation slice
 */
export const navigationSlice = createSlice({
	name: 'fuse/navigation',
	initialState,
	reducers: {
		setNavigation: (state, action) =>
			navigationAdapter.setAll(state, action.payload),
		resetNavigation: () => initialState
	}
});

export const { setNavigation, resetNavigation } = navigationSlice.actions;

export const selectNavigation = createSelector(
	[selectNavigationAll, selectUserRole, selectCurrentLanguageId],
	(navigation, userRole) => {
		function setAdditionalData(data) {
			return data?.map((item) => ({
				hasPermission: Boolean(FuseUtils.hasPermission(item?.auth, userRole)),
				...item,
				...(item.translate && item.title ? { title: i18next.t(`navigation:${item.translate}`) } : {}),
				...(item.children ? { children: setAdditionalData(item.children) } : {})
			}));
		}

		const translatedValues = setAdditionalData(navigation);

		return translatedValues;
	}
);

export const selectFlatNavigation = createSelector([selectNavigation], (navigation) =>
	FuseNavigationHelper.getFlatNavigation(navigation)
);

export default navigationSlice.reducer;