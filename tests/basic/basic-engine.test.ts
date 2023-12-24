import {describe, expect, test} from '@jest/globals';
import {ValidationEngine} from '../../src/engine/validation-engine';

describe('Validation engine input parameters check', () => {
	test('should return internal_error on no data', () => {
		const result = ValidationEngine.validate(void 0, {});
		expect(result.state).toBe('internal error');
		expect(result.level).toBe('unknown');
		expect(result.error).toBe('No data');
	});

	test('should return internal_error on no model', () => {
		const result = ValidationEngine.validate({}, void 0 as any);
		expect(result.state).toBe('internal error');
		expect(result.level).toBe('unknown');
		expect(result.error).toBe('No Validation Model');
	});

	test('should return internal_error on empty data', () => {
		const result = ValidationEngine.validate({}, {});
		expect(result.state).toBe('internal error');
		expect(result.level).toBe('unknown');
		expect(result.error).toBe('Empty/invalid data');
	});

	test('should return internal_error on invalid data', () => {
		const result = ValidationEngine.validate([] as any, {'a': 1} as any);
		expect(result.state).toBe('internal error');
		expect(result.level).toBe('unknown');
		expect(result.error).toBe('Empty/invalid data');
	});

	test('should return internal_error on empty model', () => {
		const result = ValidationEngine.validate({a: 1}, {});
		expect(result.state).toBe('internal error');
		expect(result.level).toBe('unknown');
		expect(result.error).toBe('Empty/invalid Validation Model');
	});

	test('should return internal_error on invalid model', () => {
		const result = ValidationEngine.validate({a: 1}, [] as any);
		expect(result.state).toBe('internal error');
		expect(result.level).toBe('unknown');
		expect(result.error).toBe('Empty/invalid Validation Model');
	});
});
