import {describe, expect, test} from '@jest/globals';
import {ValidationEngine} from '../../src/engine/validation-engine';
import {ValidatorArrayLength, ValidatorStringRequired} from "../../src";

xdescribe('Validate nested array items', () => {
	test('should fail check array items', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				contacts: {
					addresses: []
				}
			},
			{
				'contacts.addresses[]': {
					validators: [
						{
							validator: ValidatorArrayLength,
							message: 'Length must be > 0',
							params: {min: 1}
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('error');
		expect(result.errors['contacts.addresses[*]'][0]).toBe('Length must be > 0');
	});

	test('should fail check array items (2)', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				contacts: {
					addresses: ['Address 1', 'Address 2']
				}
			},
			{
				'contacts.addresses[]': {
					validators: [
						{
							validator: ValidatorArrayLength,
							message: 'Length must be > 2',
							params: {min: 3}
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('error');
		expect(result.errors['contacts.addresses[*]'][0]).toBe('Length must be > 2');
	});

	test('should pass check array items', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				contacts: {
					addresses: ['Address 1', 'Address 2']
				}
			},
			{
				'contacts.addresses[]': {
					validators: [
						{
							validator: ValidatorArrayLength,
							message: 'Length must be > 1',
							params: {min: 2}
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('none');
	});

	test('should fail check array items per item (empty string)', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				contacts: {
					addresses: ['Address 1', '', 'Address 2']
				}
			},
			{
				'contacts.addresses[*]': {
					validators: [
						{
							validator: ValidatorStringRequired,
							message: 'Item must have the value',
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('error');
		expect(result.errors['contacts.addresses[1]'][0]).toBe('Item must have the value');
	});

	test('should fail check array items per item (undefined)', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				contacts: {
					addresses: ['Address 1', 'Address 2', undefined, 'Address 4']
				}
			},
			{
				'contacts.addresses[*]': {
					validators: [
						{
							validator: ValidatorStringRequired,
							message: 'Item must have the value',
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('error');
		expect(result.errors['contacts.addresses[2]'][0]).toBe('Item must have the value');
	});

	test('should pass check array items per item', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				contacts: {
					addresses: ['Address 1', 'Address 2', 'Address 3']
				}
			},
			{
				'contacts.addresses[*]': {
					validators: [
						{
							validator: ValidatorStringRequired,
							message: 'Item must have the value',
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('none');
	});

	test('should pass check array items per item, compound', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				contacts: {
					addresses: ['Address 1', 'Address 2', 'Address 3']
				}
			},
			{
				'contacts.addresses[]': {
					validators: [
						{
							validator: ValidatorArrayLength,
							message: 'Length must be > 0',
							params: {min: 1}
						}
					]
				},
				'contacts.addresses[*]': {
					validators: [
						{
							validator: ValidatorStringRequired,
							message: 'Item must have the value',
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('none');
	});
});
