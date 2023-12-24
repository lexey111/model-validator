import {describe, expect, test} from '@jest/globals';
import {ValidatorStringRequired} from '../../src/validators/validator-string-required';
import {ValidationEngine} from '../../src/engine/validation-engine';
import {ValidatorStringLength} from "../../src/validators/validator-string-length";

describe('Validate rule active/non active', () => {
	test('should pass validation', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John', surName: 'Smith'
			},
			{
				'name': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Name is required'
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.error).toBeUndefined();
		expect(result.level).toBe('none');
	});

	test('should fail validation with no conditions', () => {
		const result = ValidationEngine.validate(
			{
				name: '', surName: 'Smith'
			},
			{
				'name': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Name is required'
						}
					]
				},
				'surName': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Surname is required'
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.error).toBeUndefined();
		expect(result.level).toBe('error');
	});

	test('should fail validation with static condition', () => {
		const result = ValidationEngine.validate(
			{
				name: '', surName: 'Smith'
			},
			{
				'name': {
					active: true,
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Name is required'
						}
					]
				},
				'surName': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Surname is required'
						}
					]
				},
			});

		expect(result.level).toBe('error');
	});

	test('should pass validation with static condition', () => {
		const result = ValidationEngine.validate(
			{
				name: '', surName: 'Smith'
			},
			{
				'name': {
					active: false,
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Name is required'
						}
					]
				},
				'surName': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Surname is required'
						}
					]
				},
			});

		expect(result.level).toBe('none');
	});

	test('should fail validation with dynamic condition', () => {
		const result = ValidationEngine.validate(
			{
				name: '', surName: 'Smith'
			},
			{
				'name': {
					active: () => true,
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Name is required'
						}
					]
				},
				'surName': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Surname is required'
						}
					]
				},
			});

		expect(result.level).toBe('error');
	});

	test('should pass validation with dynamic condition', () => {
		const result = ValidationEngine.validate(
			{
				name: '', surName: 'Smith'
			},
			{
				'name': {
					active: () => false,
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Name is required'
						}
					]
				},
				'surName': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Surname is required'
						}
					]
				},
			});

		expect(result.level).toBe('none');
	});

	test('should pass validation with complex condition', () => {
		const result = ValidationEngine.validate(
			{
				name: '', surName: 'Smith'
			},
			{
				'name': {
					active: (data) => data.surName !== 'Smith',
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Name is required'
						}
					]
				},
				'surName': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Surname is required'
						}
					]
				},
			});

		expect(result.level).toBe('none');
	});

	test('should fail validation with complex condition', () => {
		const result = ValidationEngine.validate(
			{
				name: '', surName: 'Brown'
			},
			{
				'name': {
					active: (data) => data.surName !== 'Smith',
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Name is required'
						}
					]
				},
				'surName': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Surname is required'
						}
					]
				},
			});

		expect(result.level).toBe('error');
	});

	test('should fail validation with complex condition by value', () => {
		const result1 = ValidationEngine.validate(
			{
				name: 'Joe'
			},
			{
				'name': {
					active: (data, value) => (value !== 'John'),
					validators: [
						{
							validate: ValidatorStringLength,
							params: {min: 10},
							message: 'Minimal length of name, if not "John", is 10'
						}
					]
				}
			});

		expect(result1.level).toBe('error');

		const result2 = ValidationEngine.validate(
			{
				name: 'Mark Fitzgerald Brown Jr.'
			},
			{
				'name': {
					active: (data, value) => (value !== 'John'),
					validators: [
						{
							validate: ValidatorStringLength,
							params: {min: 10},
							message: 'Minimal length of name, if not "John", is 10'
						}
					]
				}
			});

		expect(result2.level).toBe('none');
	});

	test('should fail validation with complex condition by value', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John'
			},
			{
				'name': {
					active: (data, value) => (value !== 'John'),
					validators: [
						{
							validate: ValidatorStringLength,
							params: {min: 10},
							message: 'Minimal length of name, if not "John", is 10'
						}
					]
				}
			});

		expect(result.level).toBe('none');
	});

});
