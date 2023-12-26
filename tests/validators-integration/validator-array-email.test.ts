import {describe, expect, test} from '@jest/globals';
import {ValidationEngine} from '../../src/engine/validation-engine';
import {ValidatorEmail} from "../../src/validators/validator-email";


describe('Validate array with emails', () => {

	test('should fail check array items', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				addresses: ['address 1', 'invalid email', 'address 3']
			},
			{
				'addresses[1]': {
					message: 'Invalid email',
					validators: [
						{
							validator: ValidatorEmail,
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.stats.total_skipped).toBe(0);
		expect(result.level).toBe('error');
		expect(result.errors['addresses[1]'][0]).toBe('Invalid email');
	});

	test('should pass check array items', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				addresses: ['address 1', 'address@normal.com', 'address 3']
			},
			{
				'addresses[1]': {
					validators: [
						{
							validator: ValidatorEmail,
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.stats.total_skipped).toBe(0);
		expect(result.level).toBe('none');
	});

	test('should skip check array items', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				addresses: ['address 1', 'address@normal.com', 'address 3']
			},
			{
				'addresses[3]': {
					validators: [
						{
							validator: ValidatorEmail,
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('none');
		expect(result.stats.total_skipped).toBe(1);
	});

});
