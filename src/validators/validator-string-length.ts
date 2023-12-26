import {type TValidatorFn} from '../engine/validation-types';

export const ValidatorStringLength: TValidatorFn = (str: string, params: {
	min?: number,
	max?: number,
	skipIfEmpty?: boolean,
	trim?: boolean
}) => {

	if (typeof str !== 'string' || (typeof params?.min !== 'undefined' && typeof params?.min !== 'number') || (typeof params?.max !== 'undefined' && typeof params?.max !== 'number')) {
		return undefined;
	}

	const checkStr = (params?.trim === true ? str.trim() : str) || '';
	const checkStrLength = checkStr.length;

	return (!checkStr && params?.skipIfEmpty === true)
		? undefined
		: (typeof params?.min !== 'number' && typeof params?.max !== 'number')
			? false
			: checkStrLength >= (params?.min || 0) && checkStrLength <= (params?.max ?? Infinity);
}
