import {TValidationModel, ValidationEngine} from "../../src";
import {describe, expect, test} from "@jest/globals";

const UserDataValid = {
	personalData: {
		name: 'John',
		surname: 'Doe'
	},
};

const UserDataInvalid = {
	personalData: {
		name: 'Jane',
		surname: 'Doe'
	},
};

function customValidator(val: string) {
	return val.indexOf('oh') !== -1;
}

const _customValidator = jest.fn();

const CustomValidationSpy: TValidationModel = {
	'personalData.name': {
		validators: [
			{
				validator: _customValidator,
				message: 'Name must include "oh"!'
			}
		]
	}
}

const CustomValidation: TValidationModel = {
	'personalData.name': {
		level: 'warning',
		validators: [
			{
				validator: customValidator,
				message: 'Name must include "oh"!'
			}
		]
	}
}

describe('Custom validator test', () => {
	test('should call the custom validator', () => {
		const result = ValidationEngine.validate(UserDataInvalid, CustomValidationSpy);

		expect(_customValidator).toHaveBeenCalled();
	});

	test('should pass validation', () => {
		const result = ValidationEngine.validate(UserDataValid, CustomValidation);

		expect(result.level).toBe('none');
	});

	test('should fail validation', () => {
		const result = ValidationEngine.validate(UserDataInvalid, CustomValidation);

		expect(result.level).toBe('warning');
		expect(result.warnings['personalData.name'][0]).toBe('Name must include "oh"!')
	});
});
