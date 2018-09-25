/** @format */
/**
 * Internal dependencies
 */
import { combineReducers, createReducer } from 'state/utils';
import {
	IMPORT_IS_SITE_IMPORTABLE_ERROR,
	IMPORT_IS_SITE_IMPORTABLE_RECEIVE,
	IMPORTER_NUX_URL_INPUT_SET,
	IMPORT_IS_SITE_IMPORTABLE_START_FETCH,
} from 'state/action-types';

export const urlInputValue = ( state = '', action ) =>
	action.type === IMPORTER_NUX_URL_INPUT_SET ? action.value : state;

export const isUrlInputDisabled = createReducer( false, {
	[ IMPORT_IS_SITE_IMPORTABLE_START_FETCH ]: () => true,
	[ IMPORT_IS_SITE_IMPORTABLE_RECEIVE ]: () => false,
	[ IMPORT_IS_SITE_IMPORTABLE_ERROR ]: () => false,
} );

export const siteDetails = createReducer(
	{},
	{
		[ IMPORT_IS_SITE_IMPORTABLE_RECEIVE ]: ( state, { response = {} } ) => ( {
			engine: response.engine,
			favicon: response.favicon,
			siteTitle: response.site_title,
			siteUrl: response.site_url,
		} ),
		[ IMPORT_IS_SITE_IMPORTABLE_ERROR ]: () => null,
	}
);

export const error = createReducer( null, {
	[ IMPORT_IS_SITE_IMPORTABLE_START_FETCH ]: () => null,
	[ IMPORT_IS_SITE_IMPORTABLE_RECEIVE ]: () => null,
	[ IMPORT_IS_SITE_IMPORTABLE_ERROR ]: ( _state, action ) => action.error,
} );

export default combineReducers( {
	urlInputValue,
	siteDetails,
	error,
	isUrlInputDisabled,
} );
