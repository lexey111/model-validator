import {describe, expect, test} from '@jest/globals';
import {ValidatorStringLength} from '../../src/validators/validator-string-length';

describe('Validator string length', () => {
	test('should pass with normal string and both params', () => {
		const result = ValidatorStringLength('abc', {min: 0, max: 100});
		expect(result).toBe(true);
	});

	test('should fail without params', () => {
		const result = ValidatorStringLength('abc');
		expect(result).toBe(false);
	});

	test('should fail without params on empty string (min === 0)', () => {
		const result = ValidatorStringLength('');
		expect(result).toBe(false);
	});

	test('should fail without params on empty string and without skipIfEmpty', () => {
		const result = ValidatorStringLength('');
		expect(result).toBe(false);
	});

	test('should be undefined without params on empty string and with skipIfEmpty', () => {
		const result = ValidatorStringLength('', {skipIfEmpty: true});
		expect(result).toBeUndefined();
	});

	test('should pass without string and with params by default', () => {
		const result = ValidatorStringLength('', {min: 0, max: 100});
		expect(result).toBe(true);
	});

	test('should return undefined without string and skipIfEmpty and correct min', () => {
		const result = ValidatorStringLength('', {min: 0, max: 100, skipIfEmpty: true});
		expect(result).toBeUndefined();
	});

	test('should return undefined without string and skipIfEmpty and too big min', () => {
		const result = ValidatorStringLength('', {min: 1, max: 100, skipIfEmpty: true});
		expect(result).toBeUndefined();
	});

	test('should return undefined with invalid data type', () => {
		const result1 = ValidatorStringLength([], {min: 0, max: 100});
		expect(result1).toBeUndefined();

		const result2 = ValidatorStringLength([1, 2, 3], {min: 0, max: 100});
		expect(result2).toBeUndefined();

		const result3 = ValidatorStringLength({}, {min: 0, max: 100});
		expect(result3).toBeUndefined();

		const result4 = ValidatorStringLength(undefined, {min: 0, max: 100});
		expect(result4).toBeUndefined();

		const result5 = ValidatorStringLength(null, {min: 0, max: 100});
		expect(result5).toBeUndefined();

		const result6 = ValidatorStringLength(() => void 0, {min: 0, max: 100});
		expect(result6).toBeUndefined();
	});

	test('should return undefined with invalid data type and skipIfEmpty', () => {
		const result1 = ValidatorStringLength([], {min: 0, max: 100, skipIfEmpty: true});
		expect(result1).toBeUndefined();

		const result2 = ValidatorStringLength([1, 2, 3], {min: 0, max: 100, skipIfEmpty: true});
		expect(result2).toBeUndefined();

		const result3 = ValidatorStringLength({}, {min: 0, max: 100, skipIfEmpty: true});
		expect(result3).toBeUndefined();

		const result4 = ValidatorStringLength(undefined, {min: 0, max: 100, skipIfEmpty: true});
		expect(result4).toBeUndefined();

		const result5 = ValidatorStringLength(null, {min: 0, max: 100, skipIfEmpty: true});
		expect(result5).toBeUndefined();
	});

	test('should return undefined with invalid data type and trim', () => {
		const result1 = ValidatorStringLength([], {min: 0, max: 100, trim: true});
		expect(result1).toBeUndefined();

		const result2 = ValidatorStringLength([1, 2, 3], {min: 0, max: 100, trim: true});
		expect(result2).toBeUndefined();

		const result3 = ValidatorStringLength({}, {min: 0, max: 100, trim: true});
		expect(result3).toBeUndefined();

		const result4 = ValidatorStringLength(undefined, {min: 0, max: 100, trim: true});
		expect(result4).toBeUndefined();

		const result5 = ValidatorStringLength(null, {min: 0, max: 100, trim: true});
		expect(result5).toBeUndefined();
	});

	test('should fail when min > max', () => {
		const result = ValidatorStringLength('abc', {min: 100, max: 0});
		expect(result).toBe(false);
	});

	test('should return undefined with invalid min or max type', () => {
		const result1 = ValidatorStringLength('abc', {min: 'A', max: 100});
		expect(result1).toBeUndefined();

		const result2 = ValidatorStringLength('abc', {min: 1, max: '100'});
		expect(result2).toBeUndefined();
	});

	test('should pass without max length', () => {
		const result1 = ValidatorStringLength('abc', {min: 0});
		expect(result1).toBe(true);

		const result2 = ValidatorStringLength('abc', {min: 1});
		expect(result2).toBe(true);

		const result3 = ValidatorStringLength('abc', {min: 2});
		expect(result3).toBe(true);

		const result4 = ValidatorStringLength('abc', {min: 3});
		expect(result4).toBe(true);

		const result5 = ValidatorStringLength('abc', {min: 4});
		expect(result5).toBe(false);
	});

	test('should trim string if trim === true', () => {
		const result1 = ValidatorStringLength('abc   ', {min: 5});
		expect(result1).toBe(true);

		const result2 = ValidatorStringLength('abc   ', {min: 5, trim: true});
		expect(result2).toBe(false);

		const result3 = ValidatorStringLength('   abc', {min: 5});
		expect(result3).toBe(true);

		const result4 = ValidatorStringLength('   abc', {min: 5, trim: true});
		expect(result4).toBe(false);

		const result5 = ValidatorStringLength('   abc   ', {min: 5});
		expect(result5).toBe(true);

		const result6 = ValidatorStringLength('   abc   ', {min: 5, trim: true});
		expect(result6).toBe(false);
	});

	test('should check min and max', () => {
		const result1 = ValidatorStringLength('abc', {min: 0, max: 3});
		expect(result1).toBe(true);

		const result2 = ValidatorStringLength('abc', {min: 0, max: 2});
		expect(result2).toBe(false);

		const result3 = ValidatorStringLength('abc', {max: 2});
		expect(result3).toBe(false);

		const result4 = ValidatorStringLength('abc', {max: 3});
		expect(result4).toBe(true);

		const result5 = ValidatorStringLength('abc', {max: 4});
		expect(result5).toBe(true);

		const result6 = ValidatorStringLength('abc', {min: 3, max: 3});
		expect(result6).toBe(true);
	});

	test('should check NEGATIVE min and max', () => {
		const result1 = ValidatorStringLength('abc', {min: -1});
		expect(result1).toBe(true);

		const result2 = ValidatorStringLength('abc', {min: -1, max: 3});
		expect(result2).toBe(true);

		const result3 = ValidatorStringLength('abc', {min: 0, max: -3});
		expect(result3).toBe(false);

		const result4 = ValidatorStringLength('abc', {max: -3});
		expect(result4).toBe(false);

		const result5 = ValidatorStringLength('abc', {min: -5, max: -3});
		expect(result5).toBe(false);
	});
});
