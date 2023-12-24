import {describe, expect, test} from '@jest/globals';
import {TValidationModel} from "../../src/engine/validation-types";
import {ValidatorStringRequired} from '../../src/validators/validator-string-required';
import {ValidatorEmail} from "../../src/validators/validator-email";
import {ValidationEngine} from "../../src/engine/validation-engine";

const SimpleValidData = {
	name: 'John',
	surname: 'Smith',
	email: 'john@smith.com'
};

const SimpleInvalidData1 = {
	name: '',
	surname: ''
};

const SimpleInvalidData2 = {
	name: 'Joe',
	surname: '',
	email: 'xxx'
};

const SimpleValidationModel: TValidationModel = {
	'name': {
		validators: [
			{
				validate: ValidatorStringRequired
			}
		]
	},
	'email': {
		level: 'warning',
		validators: [
			{
				validate: ValidatorStringRequired,
				message: 'Please fill the email field if you want to receive spam'
			},
			{
				validate: ValidatorEmail,
				params: {skipIfEmpty: true},
				message: 'Please use correct email'
			}
		]
	},
	'surname': {
		level: 'notice',
		validators: [
			{
				validate: ValidatorStringRequired,
				message: (data) => `${data.name || 'Unknown'}, please fill the Surname field`
			}
		]
	}
}


describe('Simple compound validation', () => {
	test('should pass with valid data', () => {
		const result = ValidationEngine.validate(SimpleValidData, SimpleValidationModel);
		expect(result.level).toBe('none');
	});

	test('should fail with invalid data (error)', () => {
		const result = ValidationEngine.validate(SimpleInvalidData1, SimpleValidationModel);

		expect(result.level).toBe('error');
		expect(result.stats.total_errors).toBe(1);
		expect(result.stats.total_notices).toBe(1);

		expect(result.errors['name']).toBeTruthy();
		expect(result.errors['name'].length).toBe(1);
		expect(result.errors['name'][0]).toBe('Empty message, "name"');

		expect(result.notices['surname']).toBeTruthy();
		expect(result.notices['surname'].length).toBe(1);
		expect(result.notices['surname'][0]).toBe('Unknown, please fill the Surname field');
	});

	test('should fail with invalid data (warning)', () => {
		const result = ValidationEngine.validate(SimpleInvalidData2, SimpleValidationModel);

		expect(result.level).toBe('warning');
		expect(result.stats.total_errors).toBe(0);
		expect(result.stats.total_warnings).toBe(1);
		expect(result.stats.total_notices).toBe(1);

		expect(result.warnings['email']).toBeTruthy();
		expect(result.warnings['email'].length).toBe(1);
		expect(result.warnings['email'][0]).toBe('Please use correct email');
	});
});
