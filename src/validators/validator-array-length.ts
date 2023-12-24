import type {TValidatorFn} from '../engine/validation-types';

export const ValidatorArrayLength: TValidatorFn = (data: Array<any>, params: {
	min?: number,
	max?: number,
	skipIfEmpty?: boolean
}) => {

	if (!Array.isArray(data) || (typeof params?.min !== 'undefined' && typeof params?.min !== 'number') || (typeof params?.max !== 'undefined' && typeof params?.max !== 'number')) {
		return undefined;
	}

	const checkArrLength = data.length;

	return (checkArrLength === 0 && params?.skipIfEmpty === true)
		? undefined
		: (typeof params?.min !== 'number' && typeof params?.max !== 'number')
			? false
			: checkArrLength >= (params?.min || 0) && checkArrLength <= (params?.max ?? Infinity);
}
