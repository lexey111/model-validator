import {type TValidatorFn} from '../engine/validation-types';

const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

export const ValidatorEmail: TValidatorFn = (email: string, params: {
	skipIfEmpty?: boolean,
}) => {
	if (typeof email === 'undefined' || !email) {
		if (params?.skipIfEmpty === true) {
			return undefined;
		}
		return false;
	}

	if (typeof email !== 'string') {
		return undefined;
	}

	pattern.lastIndex = 0;
	return pattern.test(email);
}
