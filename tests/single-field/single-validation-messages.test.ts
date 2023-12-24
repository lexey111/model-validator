import {describe, expect, test} from '@jest/globals';
import {ValidatorStringRequired} from '../../src/validators/validator-string-required';
import {ValidationEngine} from '../../src/engine/validation-engine';

const data = {name: '', surname: 'Johnson'};


describe('Validate single field - messages', () => {
	test('should include correct error message on validator (static)', () => {
		const result = ValidationEngine.validate(data, {
			'name': {
				validators: [
					{
						validate: ValidatorStringRequired,
						message: 'Message from validator'
					}
				]
			},
		});
		expect(result.errors['name']).toBeTruthy();
		expect(result.errors['name'].length).toBe(1);
		expect(result.errors['name'][0]).toBe('Message from validator');
	});

	test('should include correct error message on rule level (static)', () => {
		const result = ValidationEngine.validate(data, {
			'name': {
				message: 'Message from rule',
				validators: [
					{
						validate: ValidatorStringRequired,
					}
				]
			},
		});

		expect(result.errors['name']).toBeTruthy();
		expect(result.errors['name'].length).toBe(1);
		expect(result.errors['name'][0]).toBe('Message from rule');
	});

	test('should include correct error message when no message provided at all', () => {
		const result = ValidationEngine.validate(data, {
			'name': {
				validators: [
					{
						validate: ValidatorStringRequired,
					}
				]
			},
		});

		expect(result.errors['name']).toBeTruthy();
		expect(result.errors['name'].length).toBe(1);
		expect(result.errors['name'][0]).toBe('Empty message, "name"');
	});

	describe('No messages, validator', () => {
		test('should include correct error message when validator message function returns empty string', () => {
			const result = ValidationEngine.validate(data, {
				'name': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: () => ''
						}
					]
				},
			});

			expect(result.errors['name']).toBeTruthy();
			expect(result.errors['name'].length).toBe(1);
			expect(result.errors['name'][0]).toBe('Empty message (validator), "name"');
		});

		test('should include correct error message when validator message function returns null', () => {
			const result = ValidationEngine.validate(data, {
				'name': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: () => null as any
						}
					]
				},
			});

			expect(result.errors['name']).toBeTruthy();
			expect(result.errors['name'].length).toBe(1);
			expect(result.errors['name'][0]).toBe('Empty message (validator), "name"');
		});

		test('should include correct error message when validator message function returns number', () => {
			const result = ValidationEngine.validate(data, {
				'name': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: () => 42 as any
						}
					]
				},
			});

			expect(result.errors['name']).toBeTruthy();
			expect(result.errors['name'].length).toBe(1);
			expect(result.errors['name'][0]).toBe('Empty message (validator), "name"');
		});

		test('should include correct error message when validator message function returns an array', () => {
			const result = ValidationEngine.validate(data, {
				'name': {
					validators: [
						{
							validate: ValidatorStringRequired,
							message: () => [1, 2, 3] as any
						}
					]
				},
			});

			expect(result.errors['name']).toBeTruthy();
			expect(result.errors['name'].length).toBe(1);
			expect(result.errors['name'][0]).toBe('Empty message (validator), "name"');
		});
	});

	describe('No messages, rule', () => {
		test('should include correct error message when rule message function returns empty string', () => {
			const result = ValidationEngine.validate(data, {
				'name': {
					message: () => '',
					validators: [
						{
							validate: ValidatorStringRequired,
						}
					]
				},
			});

			expect(result.errors['name']).toBeTruthy();
			expect(result.errors['name'].length).toBe(1);
			expect(result.errors['name'][0]).toBe('Empty message (rule), "name"');
		});

		test('should include correct error message when rule message function returns null', () => {
			const result = ValidationEngine.validate(data, {
				'name': {
					message: () => null as any,
					validators: [
						{
							validate: ValidatorStringRequired,
						}
					]
				},
			});

			expect(result.errors['name']).toBeTruthy();
			expect(result.errors['name'].length).toBe(1);
			expect(result.errors['name'][0]).toBe('Empty message (rule), "name"');
		});

		test('should include correct error message when rule message function returns number', () => {
			const result = ValidationEngine.validate(data, {
				'name': {
					message: () => 42 as any,
					validators: [
						{
							validate: ValidatorStringRequired,
						}
					]
				},
			});

			expect(result.errors['name']).toBeTruthy();
			expect(result.errors['name'].length).toBe(1);
			expect(result.errors['name'][0]).toBe('Empty message (rule), "name"');
		});

		test('should include correct error message when rule message function returns an array', () => {
			const result = ValidationEngine.validate(data, {
				'name': {
					message: () => [1, 2, 3] as any,
					validators: [
						{
							validate: ValidatorStringRequired,
						}
					]
				},
			});

			expect(result.errors['name']).toBeTruthy();
			expect(result.errors['name'].length).toBe(1);
			expect(result.errors['name'][0]).toBe('Empty message (rule), "name"');
		});
	});


	test('should include correct error message on validation level (dynamic)', () => {
		const result = ValidationEngine.validate(data, {
			'name': {
				validators: [
					{
						validate: ValidatorStringRequired,
						message: (data) => `Name should not be empty, ${data.surname}!`
					}
				]
			},
		});

		expect(result.errors['name']).toBeTruthy();
		expect(result.errors['name'].length).toBe(1);
		expect(result.errors['name'][0]).toBe('Name should not be empty, Johnson!');
	});

	test('should include correct error message on rule level (dynamic)', () => {
		const result = ValidationEngine.validate(data, {
			'name': {
				message: (data) => `Name should not be empty, ${data.surname}!`,
				validators: [
					{
						validate: ValidatorStringRequired,
					}
				]
			},
		});

		expect(result.errors['name']).toBeTruthy();
		expect(result.errors['name'].length).toBe(1);
		expect(result.errors['name'][0]).toBe('Name should not be empty, Johnson!');
	});

	describe('Message overriding', () => {
		test('validation static message should override rule dynamic message', () => {
			const result = ValidationEngine.validate(data, {
				'name': {
					message: (data) => `Name should not be empty, ${data.surname}!`,
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Message 1'
						}
					]
				},
			});

			expect(result.errors['name']).toBeTruthy();
			expect(result.errors['name'].length).toBe(1);
			expect(result.errors['name'][0]).toBe('Message 1');
		});

		test('validation dynamic message should override rule dynamic message', () => {
			const result = ValidationEngine.validate(data, {
				'name': {
					message: (data) => `Name should not be empty, ${data.surname}!`,
					validators: [
						{
							validate: ValidatorStringRequired,
							message: () => 'Message 1',
						}
					]
				},
			});

			expect(result.errors['name']).toBeTruthy();
			expect(result.errors['name'].length).toBe(1);
			expect(result.errors['name'][0]).toBe('Message 1');
		});

		test('validation static message should override rule static message', () => {
			const result = ValidationEngine.validate(data, {
				'name': {
					message: 'Static message',
					validators: [
						{
							validate: ValidatorStringRequired,
							message: 'Message 1'
						}
					]
				},
			});

			expect(result.errors['name']).toBeTruthy();
			expect(result.errors['name'].length).toBe(1);
			expect(result.errors['name'][0]).toBe('Message 1');
		});

		test('validation dynamic message should override rule static message', () => {
			const result = ValidationEngine.validate(data, {
				'name': {
					message: 'Static message',
					validators: [
						{
							validate: ValidatorStringRequired,
							message: () => 'Message 1',
						}
					]
				},
			});

			expect(result.errors['name']).toBeTruthy();
			expect(result.errors['name'].length).toBe(1);
			expect(result.errors['name'][0]).toBe('Message 1');
		});
	});
});
