import {describe, expect, test} from '@jest/globals';
import {ValidatorStringRequired} from '../../src/validators/validator-string-required';

describe('Validator string required', () => {
	test('should pass normal string', () => {
		const result = ValidatorStringRequired('abc');
		expect(result).toBe(true);
	});

	test('should fail on empty string', () => {
		const result = ValidatorStringRequired('');
		expect(result).toBe(false);
	});

	test('should fail on whitespace string by default', () => {
		const result1 = ValidatorStringRequired(' ');
		expect(result1).toBe(false);
		const result2 = ValidatorStringRequired('\t');
		expect(result2).toBe(false);
		const result3 = ValidatorStringRequired('\r');
		expect(result3).toBe(false);
		const result4 = ValidatorStringRequired('\n');
		expect(result4).toBe(false);
	});

	test('should fail on non-string value (null)', () => {
		const result = ValidatorStringRequired(null);
		expect(result).toBe(false);
	});

	test('should fail on non-string value (number)', () => {
		const result = ValidatorStringRequired(42);
		expect(result).toBe(false);
	});

	test('should fail on non-string value (array)', () => {
		const result1 = ValidatorStringRequired([]);
		expect(result1).toBe(false);

		const result2 = ValidatorStringRequired([1, 2]);
		expect(result2).toBe(false);
	});

	test('should fail on non-string value (object)', () => {
		const result = ValidatorStringRequired({});
		expect(result).toBe(false);
	});

	test('should fail on non-string value (undefined)', () => {
		const result = ValidatorStringRequired(undefined);
		expect(result).toBe(false);
	});

	test('should pass on whitespace string if allowWhitespaces === true', () => {
		const result1 = ValidatorStringRequired(' ', {allowWhitespaces: true});
		expect(result1).toBe(true);

		const result2 = ValidatorStringRequired('\t', {allowWhitespaces: true});
		expect(result2).toBe(true);

		const result3 = ValidatorStringRequired('\r', {allowWhitespaces: true});
		expect(result3).toBe(true);

		const result4 = ValidatorStringRequired('\n', {allowWhitespaces: true});
		expect(result4).toBe(true);
	});

});
