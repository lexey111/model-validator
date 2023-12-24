import {describe, expect, test} from '@jest/globals';
import {ValidationEngine} from '../../src/engine/validation-engine';
import {ValidatorArrayLength} from '../../src/validators/validator-array-length';


describe('Validate single field - array', () => {
	test('should check empty array', () => {
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

		expect(result).toBeDefined();
		expect(result.level).toBe('error');
		expect(result.errors['addresses']).toBeTruthy();
		expect(result.errors['addresses'].length).toBe(1);
		expect(result.errors['addresses'][0]).toBe('At least 1 address must be declared');
	});

	test('should check array size (min, fail)', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				addresses: ['address 1', 'address 2']
			},
			{
				'addresses': {
					validators: [
						{
							validate: ValidatorArrayLength,
							params: {min: 3},
							message: 'Invalid array size'
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('error');
		expect(result.errors['addresses']).toBeTruthy();
		expect(result.errors['addresses'].length).toBe(1);
		expect(result.errors['addresses'][0]).toBe('Invalid array size');
	});

	test('should check array size (min, pass)', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				addresses: ['address 1', 'address 2']
			},
			{
				'addresses': {
					validators: [
						{
							validate: ValidatorArrayLength,
							params: {min: 2},
							message: 'Invalid array size'
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('none');
	});

	test('should check array size (max, fail)', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				addresses: ['address 1', 'address 2']
			},
			{
				'addresses': {
					validators: [
						{
							validate: ValidatorArrayLength,
							params: {max: 1},
							message: 'Invalid array size'
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('error');
		expect(result.errors['addresses']).toBeTruthy();
		expect(result.errors['addresses'].length).toBe(1);
		expect(result.errors['addresses'][0]).toBe('Invalid array size');
	});

	test('should check array size (max, fail)', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				addresses: ['address 1', 'address 2', 'address 3']
			},
			{
				'addresses': {
					validators: [
						{
							validate: ValidatorArrayLength,
							params: {max: 2},
							message: 'Invalid array size'
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('error');
		expect(result.errors['addresses']).toBeTruthy();
		expect(result.errors['addresses'].length).toBe(1);
		expect(result.errors['addresses'][0]).toBe('Invalid array size');
	});

	test('should check array size (max, pass)', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				addresses: ['address 1', 'address 2', 'address 3']
			},
			{
				'addresses': {
					validators: [
						{
							validate: ValidatorArrayLength,
							params: {max: 3},
							message: 'Invalid array size'
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('none');
	});

	test('should check array size (min and max, fail)', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				addresses: ['address 1', 'address 2', 'address 3']
			},
			{
				'addresses': {
					validators: [
						{
							validate: ValidatorArrayLength,
							params: {max: 2, min: 4},
							message: 'Invalid array size'
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('error');
		expect(result.errors['addresses']).toBeTruthy();
		expect(result.errors['addresses'].length).toBe(1);
		expect(result.errors['addresses'][0]).toBe('Invalid array size');
	});

	test('should check array size (min and max, pass)', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				addresses: ['address 1', 'address 2', 'address 3']
			},
			{
				'addresses': {
					validators: [
						{
							validate: ValidatorArrayLength,
							params: {max: 3, min: 1},
							message: 'Invalid array size'
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('none');
	});

	test('should check array size (min and max not setr, fail)', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				addresses: ['address 1', 'address 2', 'address 3']
			},
			{
				'addresses': {
					validators: [
						{
							validate: ValidatorArrayLength,
							message: 'Invalid array size'
						}
					]
				},
			});

		expect(result).toBeDefined();
		expect(result.level).toBe('error');
	});

});
