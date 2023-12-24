import {type TValidatorFn} from '../engine/validation-types';

export const ValidatorStringPattern: TValidatorFn = (str: string, params: {
	pattern: RegExp,
	skipIfEmpty?: boolean,
}) => {
	if (typeof str !== 'string' || params?.pattern?.constructor !== RegExp) {
		return undefined;
	}

	if (!str && params?.skipIfEmpty === true) {
		return undefined;
	}

	params.pattern.lastIndex = 0;
	return params.pattern.test(str);
}
