import {describe, expect, test} from '@jest/globals';
import {ValidatorNumberRange} from "../../src/validators/validator-number-range";

describe('Validator number range', () => {
	test('should pass with normal number and both params', () => {
		const result = ValidatorNumberRange(10, {min: 0, max: 100});
		expect(result).toBe(true);
	});

	test('should process min params', () => {
		const result1 = ValidatorNumberRange(10, {min: 0});
		expect(result1).toBe(true);

		const result2 = ValidatorNumberRange(10, {min: 10});
		expect(result2).toBe(true);

		const result3 = ValidatorNumberRange(10, {min: 11});
		expect(result3).toBe(false);
	});

	test('should process max params', () => {
		const result1 = ValidatorNumberRange(10, {max: 100});
		expect(result1).toBe(true);

		const result2 = ValidatorNumberRange(10, {max: 10});
		expect(result2).toBe(true);

		const result3 = ValidatorNumberRange(10, {max: 9});
		expect(result3).toBe(false);
	});

	test('should pass with normal number and both params, == min', () => {
		const result = ValidatorNumberRange(10, {min: 10, max: 100});
		expect(result).toBe(true);
	});

	test('should pass with normal number and both params, == max', () => {
		const result = ValidatorNumberRange(10, {min: 0, max: 10});
		expect(result).toBe(true);
	});

	test('should pass with normal number and both params, == max and min', () => {
		const result = ValidatorNumberRange(10, {min: 10, max: 10});
		expect(result).toBe(true);
	});

	test('should fail with normal number and both params out of range', () => {
		const result1 = ValidatorNumberRange(10, {min: 11, max: 100});
		expect(result1).toBe(false);

		const result2 = ValidatorNumberRange(10, {min: 0, max: 9});
		expect(result2).toBe(false);
	});

	test('should fail with undefined number', () => {
		const result = ValidatorNumberRange(undefined, {min: 11, max: 100});
		expect(result).toBe(false);
	});

	test('should fail with invalid number (array)', () => {
		const result = ValidatorNumberRange([], {min: 11, max: 100});
		expect(result).toBe(false);
	});

	test('should fail with invalid number (string)', () => {
		const result = ValidatorNumberRange('aaa', {min: 11, max: 100});
		expect(result).toBe(false);
	});

	test('should return undefined with undefined number and skipIfEmpty === true', () => {
		const result1 = ValidatorNumberRange(undefined, {min: 11, max: 100, skipIfEmpty: true});
		expect(result1).toBeUndefined();

		const result2 = ValidatorNumberRange(undefined, {skipIfEmpty: true});
		expect(result2).toBeUndefined();
	});

	test('should return undefined with invalid min or max', () => {
		const result1 = ValidatorNumberRange(10, {min: 'aaa', max: 100});
		expect(result1).toBeUndefined();

		const result2 = ValidatorNumberRange(10, {min: 0, max: {}});
		expect(result2).toBeUndefined();
	});
});
