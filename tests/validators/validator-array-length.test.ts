import {describe, expect, test} from '@jest/globals';
import {ValidatorArrayLength} from "../../src/validators/validator-array-length";

describe('Validator array length', () => {
	test('should pass with normal array and both params', () => {
		const result = ValidatorArrayLength([1, 2, 3], {min: 0, max: 100});
		expect(result).toBe(true);
	});

	test('should pass with normal array and min params', () => {
		const result1 = ValidatorArrayLength([1, 2, 3], {min: 1});
		expect(result1).toBe(true);

		const result2 = ValidatorArrayLength([1, 2, 3], {min: 2});
		expect(result2).toBe(true);

		const result3 = ValidatorArrayLength([1, 2, 3], {min: 3});
		expect(result3).toBe(true);
	});

	test('should fail with normal array and min params', () => {
		const result = ValidatorArrayLength([1, 2, 3], {min: 4});
		expect(result).toBe(false);
	});

	test('should fail with normal array and without params', () => {
		const result = ValidatorArrayLength([1, 2, 3]);
		expect(result).toBe(false);
	});

	test('should fail with empty array and without params', () => {
		const result = ValidatorArrayLength([]);
		expect(result).toBe(false);
	});

	test('should return undefined if skipIfEmpty === true, no params, empty array', () => {
		const result = ValidatorArrayLength([], {skipIfEmpty: true});
		expect(result).toBeUndefined();
	});

	test('should fail empty normal array and min params', () => {
		const result1 = ValidatorArrayLength([], {min: 0});
		expect(result1).toBe(true);

		const result2 = ValidatorArrayLength([], {min: 1});
		expect(result2).toBe(false);
	});

	test('should fail with normal array and max params', () => {
		const result1 = ValidatorArrayLength([1, 2, 3], {max: 3});
		expect(result1).toBe(true);

		const result2 = ValidatorArrayLength([1, 2, 3], {max: 2});
		expect(result2).toBe(false);
	});

	test('should return undefined with invalid values and params', () => {
		const result1 = ValidatorArrayLength(42 as any, {min: 0, max: 10});
		expect(result1).toBeUndefined();

		const result2 = ValidatorArrayLength({} as any, {min: 0, max: 10});
		expect(result2).toBeUndefined();
	});

	test('should return undefined on empty array and skipIfEmpty === true', () => {
		const result1 = ValidatorArrayLength([], {min: 0, max: 10});
		expect(result1).toBe(true);

		const result2 = ValidatorArrayLength([], {min: 0, max: 10, skipIfEmpty: true});
		expect(result2).toBeUndefined();
	});
});
