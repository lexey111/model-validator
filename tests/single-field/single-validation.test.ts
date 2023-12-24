import {describe, expect, test} from '@jest/globals';
import {TValidationModel} from "../../src/engine/validation-types";
import {ValidatorStringRequired} from '../../src/validators/validator-string-required';
import {ValidationEngine} from '../../src/engine/validation-engine';

const SingleValidationModel: TValidationModel = {
	'name': {
		validators: [
			{
				validate: ValidatorStringRequired,
				message: 'Name is required'
			}
		]
	},
}

describe('Validate single field', () => {
	test('should pass validation', () => {
		const result = ValidationEngine.validate({name: 'John'}, SingleValidationModel);

		expect(result).toBeDefined();
		expect(result.error).toBeUndefined();
		expect(result.level).toBe('none');
	});

	test('should have correct stats', () => {
		const result = ValidationEngine.validate({name: 'John'}, SingleValidationModel);

		expect(result.stats.processed_rules).toBe(1);
		expect(result.stats.total_errors).toBe(0);
		expect(result.stats.total_notices).toBe(0);
		expect(result.stats.total_skipped).toBe(0);
		expect(result.stats.total_warnings).toBe(0);
		expect(result.stats.time).toBeGreaterThan(0);
	});

	test('should detect error on empty value', () => {
		const result = ValidationEngine.validate({name: ''}, SingleValidationModel);

		expect(result.level).toBe('error');
		expect(result.stats.processed_rules).toBe(1);
		expect(result.stats.total_errors).toBe(1);
		expect(result.stats.total_notices).toBe(0);
		expect(result.stats.total_skipped).toBe(0);
		expect(result.stats.total_warnings).toBe(0);
		expect(result.stats.time).toBeGreaterThan(0);
	});

	test('should detect error on undefined value', () => {
		const result = ValidationEngine.validate({name: undefined}, SingleValidationModel);

		expect(result.level).toBe('error');
		expect(result.errors['name']).toBeTruthy();
	});

	test('should detect error on incorrect value type', () => {
		const result = ValidationEngine.validate({name: 0}, SingleValidationModel);

		expect(result.level).toBe('error');
		expect(result.errors['name']).toBeTruthy();
	});

	test('should detect error on incorrect value type (empty array)', () => {
		const result = ValidationEngine.validate({name: []}, SingleValidationModel);

		expect(result.level).toBe('error');
		expect(result.errors['name']).toBeTruthy();
	});

	test('should detect error on incorrect value type (not empty array)', () => {
		const result = ValidationEngine.validate({name: ['AAA']}, SingleValidationModel);

		expect(result.level).toBe('error');
		expect(result.errors['name']).toBeTruthy();
		expect(result.errors['name'].length).toBe(1);
		expect(result.errors['name'][0]).toBe('Name is required');
	});

	test('should detect error on incorrect value type (empty object)', () => {
		const result = ValidationEngine.validate({name: {}}, SingleValidationModel);

		expect(result.level).toBe('error');
		expect(result.errors['name']).toBeTruthy();
	});

	test('should detect error on incorrect value type (not empty object)', () => {
		const result = ValidationEngine.validate({name: {a: 1}}, SingleValidationModel);

		expect(result.level).toBe('error');
		expect(result.errors['name']).toBeTruthy();
	});

	test('should skip check on incorrect path', () => {
		const result = ValidationEngine.validate({surname: 'name'}, SingleValidationModel);

		expect(result.level).toBe('none');
		expect(result.stats.processed_rules).toBe(0);
		expect(result.stats.total_errors).toBe(0);
		expect(result.stats.total_notices).toBe(0);
		expect(result.stats.total_skipped).toBe(1);
		expect(result.stats.total_warnings).toBe(0);
	});

	test('should include error report', () => {
		const result = ValidationEngine.validate({name: ''}, SingleValidationModel);

		expect(result.errors['name']).toBeTruthy();
		expect(result.errors['name'].length).toBe(1);
		expect(result.errors['name'][0]).toBe('Name is required');
	});

});
