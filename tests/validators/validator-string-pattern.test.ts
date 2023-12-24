import {describe, expect, test} from '@jest/globals';
import {ValidatorStringPattern} from "../../src/validators/validator-string-pattern";

describe('Validator string pattern', () => {
	test('should pass with normal strings', () => {
		const result = ValidatorStringPattern('abc1def', {pattern: /abc\d+def/i});
		expect(result).toBe(true);
	});

	test('should pass with normal strings-2', () => {
		const result1 = ValidatorStringPattern('aaA', {pattern: /^[aA]{3}$/});
		expect(result1).toBe(true);

		const result2 = ValidatorStringPattern('aaAa', {pattern: /^[aA]{3}$/});
		expect(result2).toBe(false);
	});

	test('should fail with normal strings', () => {
		const result = ValidatorStringPattern('abc1abc', {pattern: /abc\d+def/i});
		expect(result).toBe(false);
	});

	test('should return undefined on invalid strings', () => {
		[undefined, 42, [], {}, null].forEach(str => {
			const result = ValidatorStringPattern(str, {pattern: /abc\d+def/i});
			expect(result).toBeUndefined();
		});

		const result = ValidatorStringPattern(undefined);
		expect(result).toBeUndefined();
	});

	test('should return undefined on invalid patterns', () => {
		[undefined, 42, 'aaaa', [], {}, null].forEach(pattern => {
			const result = ValidatorStringPattern('abc1abc', {pattern});
			expect(result).toBeUndefined();
		});

		const result = ValidatorStringPattern('abc1abc');
		expect(result).toBeUndefined();
	});

	test('should fail with on empty string without skipIfEmpty', () => {
		const result = ValidatorStringPattern('', {pattern: /abc\d+def/i});
		expect(result).toBe(false);
	});

	test('should return undefined on empty string with skipIfEmpty === true', () => {
		const result = ValidatorStringPattern('', {pattern: /abc\d+def/i, skipIfEmpty: true});
		expect(result).toBeUndefined();
	});
});
