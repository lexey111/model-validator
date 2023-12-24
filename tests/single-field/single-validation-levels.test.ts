import {describe, expect, test} from '@jest/globals';
import {ValidatorStringRequired} from '../../src/validators/validator-string-required';
import {ValidationEngine} from '../../src/engine/validation-engine';

const data = {name: ''};

describe('Validate single field - levels', () => {
	test('should has overall level error if no level is set at all', () => {
		const result = ValidationEngine.validate(data, {
			'name': {
				validators: [
					{
						validator: ValidatorStringRequired,
						message: 'Name is required',
					}
				]
			},
		});

		expect(result.level).toBe('error');
	});

	test('should has overall level error (validator)', () => {
		const result = ValidationEngine.validate(data, {
			'name': {
				validators: [
					{
						validator: ValidatorStringRequired,
						message: 'Name is required',
						level: 'error'
					}
				]
			},
		});

		expect(result.level).toBe('error');
	});

	test('should has overall level warning (validator)', () => {
		const result = ValidationEngine.validate(data, {
			'name': {
				validators: [
					{
						validator: ValidatorStringRequired,
						message: 'Name is required',
						level: 'warning'
					}
				]
			},
		});

		expect(result.level).toBe('warning');
	});

	test('should has overall level info (validator)', () => {
		const result = ValidationEngine.validate(data, {
			'name': {
				validators: [
					{
						validator: ValidatorStringRequired,
						message: 'Name is required',
						level: 'notice'
					}
				]
			},
		});

		expect(result.level).toBe('notice');
	});

	test('should has overall level error (rule)', () => {
		const result = ValidationEngine.validate(data, {
			'name': {
				level: 'error',
				validators: [
					{
						validator: ValidatorStringRequired,
						message: 'Name is required',
					}
				]
			},
		});

		expect(result.level).toBe('error');
	});

	test('should has overall level warning (rule)', () => {
		const result = ValidationEngine.validate(data, {
			'name': {
				level: 'warning',
				validators: [
					{
						validator: ValidatorStringRequired,
						message: 'Name is required',
					}
				]
			},
		});

		expect(result.level).toBe('warning');
	});

	test('should has overall level info (rule)', () => {
		const result = ValidationEngine.validate({name: ''}, {
			'name': {
				level: 'notice',
				validators: [
					{
						validator: ValidatorStringRequired,
						message: 'Name is required',
					}
				]
			},
		});

		expect(result.level).toBe('notice');
	});

	describe('Levels - override', () => {
		test('rule level should override validator level', () => {
			const result = ValidationEngine.validate({name: ''}, {
				'name': {
					level: 'notice',
					validators: [
						{
							validator: ValidatorStringRequired,
							message: 'Name is required',
							level: 'error',
						}
					]
				},
			});

			expect(result.level).toBe('notice');
		});
	});
});
