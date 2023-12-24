import {describe, expect, test} from '@jest/globals';
import {ValidatorStringRequired} from '../../src/validators/validator-string-required';
import {ValidationEngine} from '../../src/engine/validation-engine';
import {ValidatorArrayLength} from '../../src/validators/validator-array-length';
import {ValidatorStringLength} from '../../src/validators/validator-string-length';

describe('Validate nested field', () => {
	test('should reach the nested field', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				address: {
					line1: {
						streetAddress: ''
					}
				}
			},
			{
				'address.line1.streetAddress': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Street address is required'
						}
					]
				},
			});

		expect(result.level).toBe('error');
		expect(result.errors['address.line1.streetAddress']).toBeTruthy();
		expect(result.errors['address.line1.streetAddress'].length).toBe(1);
		expect(result.errors['address.line1.streetAddress'][0]).toBe('Street address is required');
	});

	test('should skip non-existent nested field', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				address: {
					line1: {
						streetAddress: ''
					}
				}
			},
			{
				'address.line2.streetAddress': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Street address is required'
						}
					]
				},
			});

		expect(result.level).toBe('none');
		expect(result.stats.total_skipped).toBe(1);
		expect(result.stats.processed_rules).toBe(0);
	});

	test('should reach the nested array (size check)', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				addresses: []
			},
			{
				'addresses': {
					validators: [
						{
							validate: ValidatorArrayLength,
							params: {min: 1},
							message: 'At least 1 address must be declared'
						}
					]
				},
			});

		expect(result.level).toBe('error');
		expect(result.errors['addresses']).toBeTruthy();
		expect(result.errors['addresses'].length).toBe(1);
		expect(result.errors['addresses'][0]).toBe('At least 1 address must be declared');
	});

	describe('Nested items', () => {
		test('should skip invalid iterator', () => {
			const result = ValidationEngine.validate(
				{
					name: 'John',
					addresses: ['Street 1']
				},
				{
					'name[0]': {
						validators: [
							{
								validate: ValidatorStringRequired,
								message: 'Item must be present'
							}
						]
					},
				});

			expect(result.level).toBe('none');
			expect(result.stats.total_skipped).toBe(1);
		});

		test('should reach the nested array item (pass, addresses[0])', () => {
			const result = ValidationEngine.validate(
				{
					name: 'John',
					addresses: ['Street 1']
				},
				{
					'addresses[0]': {
						validators: [
							{
								validate: ValidatorStringRequired,
								message: 'Item must be present'
							}
						]
					},
				});

			expect(result.level).toBe('none');
			expect(result.stats.total_skipped).toBe(0);
		});

		test('should reach the nested array item (pass, addresses[1])', () => {
			const result = ValidationEngine.validate(
				{
					name: 'John',
					addresses: ['Street 1', 'Street 2']
				},
				{
					'addresses[1]': {
						validators: [
							{
								validate: ValidatorStringRequired,
								message: 'Item must be present'
							}
						]
					},
				});

			expect(result.level).toBe('none');
			expect(result.stats.total_skipped).toBe(0);
		});

		test('should reach the nested array item (fail, addresses[2])', () => {
			const result = ValidationEngine.validate(
				{
					name: 'John',
					addresses: ['Street 1', 'Street 2']
				},
				{
					'addresses[2]': {
						validators: [
							{
								validate: ValidatorStringRequired,
								message: 'Item must be present'
							}
						]
					},
				});

			expect(result.level).toBe('none');
			expect(result.stats.total_skipped).toBe(1);
		});

		test('should reach the nested array item (fail on value length)', () => {
			const result = ValidationEngine.validate(
				{
					name: 'John',
					addresses: ['Street 1']
				},
				{
					'addresses[0]': {
						validators: [
							{
								validate: ValidatorStringLength,
								params: {min: 20},
								message: (_, value) => `Min length is 20, but ${value.length} is passed.`
							}
						]
					},
				});

			expect(result.errors['addresses[0]']).toContain('Min length is 20, but 8 is passed.');
		});

		test('should reach the nested array item (pass, non-existent item)', () => {
			const result = ValidationEngine.validate(
				{
					name: 'John',
					addresses: ['Street 1']
				},
				{
					'addresses[1]': {
						validators: [
							{
								validate: ValidatorStringLength,
								params: {min: 20},
								message: 'Min length is 20'
							}
						]
					},
				});

			expect(result.level).toBe('none');
			expect(result.stats.processed_rules).toBe(0);
			expect(result.stats.total_errors).toBe(0);
			expect(result.stats.total_notices).toBe(0);
			expect(result.stats.total_skipped).toBe(1);
			expect(result.stats.total_warnings).toBe(0);
		});
	})
});
