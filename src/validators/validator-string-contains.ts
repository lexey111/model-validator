import {type TValidatorFn} from '../engine/validation-types';

export const ValidatorStringContains: TValidatorFn = (str: string, params: {
	searchString: string,
	skipIfEmpty?: boolean,
	caseSensitive?: boolean
}) => {
	if (typeof str !== 'string' || typeof params?.searchString !== 'string') {
		return undefined;
	}

	if (!str && params?.skipIfEmpty === true) {
		return undefined;
	}

	const sourceString = params.caseSensitive === true ? str : str.toLocaleUpperCase();
	const searchString = params.caseSensitive === true ? params.searchString : params.searchString.toLocaleUpperCase();

	return !params.searchString
		? false
		: sourceString.includes(searchString);
}
