import {describe, expect, test} from '@jest/globals';
import {ValidatorStringContains} from "../../src/validators/validator-string-contains";

describe('Validator string contains', () => {
	test('should pass with normal strings', () => {
		const result = ValidatorStringContains('abc', {searchString: 'a'});
		expect(result).toBe(true);
	});

	test('should fail with normal strings', () => {
		const result = ValidatorStringContains('abc', {searchString: 'd'});
		expect(result).toBe(false);
	});

	test('should pass with normal strings case insensitive by default', () => {
		const result = ValidatorStringContains('abc', {searchString: 'A'});
		expect(result).toBe(true);
	});

	test('should fail with normal strings case sensitive', () => {
		const result1 = ValidatorStringContains('abc', {searchString: 'A', caseSensitive: true});
		expect(result1).toBe(false);

		const result2 = ValidatorStringContains('abc', {searchString: 'A', caseSensitive: false});
		expect(result2).toBe(true);
	});

	test('should return undefined with invalid data types', () => {
		const result1 = ValidatorStringContains(42 as any, {searchString: 'A'});
		expect(result1).toBeUndefined();

		const result2 = ValidatorStringContains('abc', {searchString: 42 as any});
		expect(result2).toBeUndefined();
	});

	test('should fail with empty strings', () => {
		const result = ValidatorStringContains('', {searchString: 'A'});
		expect(result).toBe(false);
	});

	test('should return undefined with empty strings and skipIfEmpty === true', () => {
		const result = ValidatorStringContains('', {searchString: 'A', skipIfEmpty: true});
		expect(result).toBeUndefined();
	});

	test('should return undefined with empty search string', () => {
		const result = ValidatorStringContains('abc', {searchString: undefined});
		expect(result).toBeUndefined();
	});

});
