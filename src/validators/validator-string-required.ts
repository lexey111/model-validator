import type {TValidatorFn} from '../engine/validation-types';

export const ValidatorStringRequired: TValidatorFn = (str: string, params?: { allowWhitespaces?: boolean }) => {
	if (!str) {
		return false;
	}
	if (typeof str !== 'string') {
		return false;
	}
	if (params?.allowWhitespaces === true) {
		return true;
	}

	return str.replaceAll(/\s/g, '') !== '';
}
