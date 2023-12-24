import {describe, expect, test} from '@jest/globals';
import {TValidationModel} from "../../src/engine/validation-types";
import {ValidatorStringRequired} from '../../src/validators/validator-string-required';

const SimpleValidData = {
	name: 'John',
	surname: 'Smith',
	email: 'john@smith.com'
};

const SimpleInvalidData = {
	name: '',
	surname: ''
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
			}
		]
	},
	'surname': {
		level: 'notice',
		validators: [
			{
				validate: ValidatorStringRequired,
				message: (data) => `${data.name}, please fill the Surname field`
			}
		]
	}
}


describe('sum module', () => {
	test('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});
