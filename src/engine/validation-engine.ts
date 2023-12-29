import {getEmptyResult, getInvalidValidationResult, getMessage, isObjectEmptyOrInvalid} from "./utils";
import type {IValidationEngine, TValidationModel, TValidationResult, TValidationRule} from "./validation-types";
import {traverseObject} from "./processing";

type TProcessRule = {
	rule: TValidationRule
	validationPath: string
	value: any
	data: any
	result: TValidationResult
};

function processRule({rule, validationPath, value, data, result}: TProcessRule) {
	if (typeof rule.active !== 'undefined') {
		if (rule.active === false) {
			skipRule('[inactive]', validationPath, result);

			return; // skip as inactive, static
		}

		if (rule.active !== true) {
			if (!rule.active(data, value)) {
				skipRule('[inactive]', validationPath, result);

				return; // skip as inactive, dynamic
			}
		}
	}

	rule.validators.forEach(validator => {
		if (!validator.validator || typeof validator.validator !== 'function') {
			skipRule('[invalid validator]', validationPath, result);
			return;
		}
		result.stats.processed_validators++;

		const validation = validator.validator(value, validator.params, data);

		if (typeof validation === 'undefined') {
			result.stats.total_skipped++;
			return;
		}

		if (validation === true) {
			return;
		}

		const violationLevel = rule.level || validator.level || 'error';

		if (!['error', 'warning', 'notice'].includes(violationLevel)) {
			return;
		}

		const message = getMessage({
			validatorMessage: validator.message,
			ruleMessage: rule.message,
			path: validationPath,
			data,
			value
		});

		const resultKey = violationLevel + 's'; // errorS, warningS, noticeS

		if (!result[resultKey][validationPath]) {
			result[resultKey][validationPath] = [message];
		} else {
			result[resultKey][validationPath].push(message);
		}
	});
}

function skipRule(pathChunk: string, path: string, result: TValidationResult) {
	result.stats.total_skipped++;
	result.skipped.push(path + ', ' + pathChunk);
}

function processValidation(data: any, model: TValidationModel, result: TValidationResult) {
	const postvalidators = [];

	Object.keys(model).forEach(validationPath => {
		const rule = model[validationPath];
		if (rule.postvalidator) {
			postvalidators.push(validationPath);
			return;
		}

		if (!rule || !rule.validators || rule.validators.length === 0) {
			skipRule('[overall]', validationPath, result);
			return; // invalid rule, skip
		}
		result.stats.processed_rules++;

		traverseObject({
			path: validationPath,
			obj: data,

			processingFn: (value, path) => {
				processRule({
					rule,
					validationPath: path,
					value,
					data,
					result
				});
			},

			skippingFn: (pathChunk: string, path) => {
				skipRule(pathChunk, path, result);
			}
		});
	});

	postprocessResult(result);

	// post validation
	if (postvalidators.length > 0) {
		postvalidators.forEach(validationPath => {
			const rule = model[validationPath];

			result.stats.processed_rules++;

			const validation = rule.postvalidator(data, result);

			if (typeof validation === 'undefined') {
				result.stats.total_skipped++;
				return;
			}

			if (validation === true) {
				return;
			}

			const violationLevel = rule.level || 'error';

			if (!['error', 'warning', 'notice'].includes(violationLevel)) {
				return;
			}

			const message = getMessage({
				validatorMessage: undefined,
				ruleMessage: rule.message,
				path: validationPath,
				data
			});

			const resultKey = violationLevel + 's'; // errorS, warningS, noticeS

			if (!result[resultKey][validationPath]) {
				result[resultKey][validationPath] = [message];
			} else {
				result[resultKey][validationPath].push(message);
			}
		});
		postprocessResult(result);
	}
}

// TODO: total_errors and rules_errors
function postprocessResult(result: TValidationResult) {
	result.stats.total_errors = Object.keys(result.errors).reduce((prev, current) => prev + result.errors[current].length, 0);
	result.stats.total_warnings = Object.keys(result.warnings).reduce((prev, current) => prev + result.warnings[current].length, 0);
	result.stats.total_notices = Object.keys(result.notices).reduce((prev, current) => prev + result.notices[current].length, 0);

	if (result.stats.total_errors > 0) {
		result.level = 'error';
	} else if (result.stats.total_warnings > 0) {
		result.level = 'warning';
	} else if (result.stats.total_notices > 0) {
		result.level = 'notice';
	}
}

export const ValidationEngine: IValidationEngine = {
	validate: (data: Record<string, any>, model: TValidationModel) => {
		if (!data) {
			return getInvalidValidationResult('No data');
		}

		if (!model) {
			return getInvalidValidationResult('No Validation Model');
		}

		if (isObjectEmptyOrInvalid(data)) {
			return getInvalidValidationResult('Empty/invalid data');
		}

		if (isObjectEmptyOrInvalid(model)) {
			return getInvalidValidationResult('Empty/invalid Validation Model');
		}

		const start = performance.now();
		const result = getEmptyResult();

		result.stats.started_at = new Date();
		result.stats.finished_at = new Date();
		result.level = 'none';

		processValidation(data, model, result);


		const end = performance.now();

		result.stats.finished_at = new Date();
		result.stats.time = end - start;

		result.state = 'completed';

		return result;
	}
};
