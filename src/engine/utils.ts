import type {TValidationResult, TValidatorMessage} from "./validation-types";

export function isObjectEmptyOrInvalid(object: Record<string, any>): boolean {
	if (null === object || typeof object !== 'object') {
		return false;
	}
	return Object.keys(object).length === 0;
}

export function getEmptyResult(): TValidationResult {
	return {
		state: 'unknown',
		level: 'unknown',
		stats: {
			started_at: new Date(),
			finished_at: new Date(),
			time: 0,
			processed_rules: 0,
			processed_validators: 0,
			total_errors: 0,
			total_warnings: 0,
			total_notices: 0,
			total_skipped: 0
		},
		errors: {},
		warnings: {},
		notices: {},
		skipped: []
	};
}

export function getInvalidValidationResult(reason?: string): TValidationResult {
	const result = getEmptyResult();
	result.state = 'internal error';
	result.error = reason || 'Invalid entry parameters';

	return result;
}

type TGetMessage = {
	validatorMessage: TValidatorMessage
	ruleMessage: TValidatorMessage
	path: string
	data: any
	value?: any
}

export function getMessage({validatorMessage, ruleMessage, path, data, value}: TGetMessage): string {
	if (validatorMessage) {
		if (typeof validatorMessage === 'string') {
			return validatorMessage;
		}
		const message = validatorMessage(data, value);

		return typeof message === 'string' ? message || 'Empty message (validator), "' + path + '"' : 'Empty message (validator), "' + path + '"';
	}
	if (ruleMessage) {
		if (typeof ruleMessage === 'string') {
			return ruleMessage;
		}
		const message = ruleMessage(data, value);

		return typeof message === 'string' ? message || 'Empty message (rule), "' + path + '"' : 'Empty message (rule), "' + path + '"';
	}

	return 'Empty message, "' + path + '"';
}
