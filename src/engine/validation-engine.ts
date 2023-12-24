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
	result.stats.processed_rules++;

	if (typeof rule.active !== 'undefined') {
		if (rule.active === false) {
			return; // skip as inactive, static
		}

		if (rule.active !== true) {
			if (!rule.active(data, value)) {
				return; // skip as inactive, dynamic
			}
		}
	}

	rule.validators.forEach(validator => {
		if (!validator.validate || typeof validator.validate !== 'function') {
			return;
		}
		result.stats.processed_validators++;

		const validation = validator.validate(value, validator.params, data);

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

function skipRule(pathChunk: string, path, result: TValidationResult) {
	result.stats.total_skipped++;
	result.skipped.push(path + ', ' + pathChunk);
}

function processValidation(data: any, model: TValidationModel, result: TValidationResult) {
	Object.keys(model).forEach(validationPath => {
		const rule = model[validationPath];

		if (!rule || !rule.validators || rule.validators.length === 0) {
			return; // invalid rule, skip
		}

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
}

// TODO: aggregation
// TODO: post-processing?
// TODO: dependent rules?

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

		// postprocessing
		result.stats.total_errors = Object.keys(result.errors).length;
		result.stats.total_warnings = Object.keys(result.warnings).length;
		result.stats.total_notices = Object.keys(result.notices).length;

		if (result.stats.total_errors > 0) {
			result.level = 'error';
		} else if (result.stats.total_warnings > 0) {
			result.level = 'warning';
		} else if (result.stats.total_notices > 0) {
			result.level = 'notice';
		}

		const end = performance.now();

		result.stats.finished_at = new Date();
		result.stats.time = end - start;

		result.state = 'completed';

		return result;
	}
};
