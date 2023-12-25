import {ValidatorStringRequired} from "../../src/validators/validator-string-required";
import {ValidatorStringLength} from "../../src/validators/validator-string-length";
import {ValidatorArrayLength} from "../../src/validators/validator-array-length";
import {countErrorsLike, TValidationModel, ValidationEngine} from "../../src";
import {describe, expect, test} from "@jest/globals";

const UserData = {
	personalData: {
		name: 'John',
		surname: 'Doe'
	},
	contacts: [
		{type: 'email', value: 'johndoe@mail.com', default: true},
		{type: 'cellular', value: '8500123456678'},
		{type: 'work-phone', value: '85006543210'}
	],
	preferences: {
		colorTheme: 'dark',
		volume: 60,
	}
};

const UserValidation:TValidationModel = {
	'personalData.name': {
		validators: [
			{
				validator: ValidatorStringRequired,
				message: 'Name is required'
			}, {
				validator: ValidatorStringLength,
				params: {min: 2, skipIfEmpty: true},
				message: 'At least 2 characters, please'
			}
		]
	},
	'personalData.surname': {
		level: 'warning',
		validators: [
			{
				validator: ValidatorStringRequired, message: 'Please provide your Surname'
			},
		]
	},
	'contacts': {
		validators: [
			{
				validator: ValidatorArrayLength,
				params: {min: 1},
				message: 'Please provide at least one contact'
			}
		]
	},
	'user': {
		message: 'User data is invalid',
		postvalidator: (_, result) => {
			return (countErrorsLike('personalData', result) +
				countErrorsLike('contacts', result)) === 0;
		}
	}
}

describe('Validation of example from README', () => {
	test('should pass validation', () => {
		const result = ValidationEngine.validate(UserData, UserValidation);

		expect(result.state).toBe('completed');
		expect(result.level).toBe('none');
		expect(result.stats.total_errors).toBe(0);
		expect(result.stats.processed_rules).toBe(4);
	});
});
