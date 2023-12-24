import {type TValidatorFn} from '../engine/validation-types';

export const ValidatorNumberRange: TValidatorFn = (num: number, params: {
	min?: number,
	max?: number,
	skipIfEmpty?: boolean
}) => {
	if (typeof num === 'undefined') {
		return params?.skipIfEmpty === true ? undefined : false;
	}

	if ((typeof params?.min !== 'undefined' && typeof params?.min !== 'number') || (typeof params?.max !== 'undefined' && typeof params?.max !== 'number')) {
		return undefined;
	}

	const hasMin = typeof params?.min === 'number';
	const hasMax = typeof params?.max === 'number';

	if (!hasMin && !hasMax) {
		return undefined;
	}

	return hasMax && hasMin
		? num >= params.min && num <= params.max
		: hasMin
			? num >= params.min
			: num <= params.max;
}
