import {describe, expect, test} from '@jest/globals';
import {countErrorsLike, ValidationEngine} from "../../src";
import {ValidatorEmail} from "../../src/validators/validator-email";
import {ValidatorStringRequired} from "../../src/validators/validator-string-required";

const BadData = {
	user: {
		data: {
			name: '',
			surname: 'Doe',
			contacts: {
				email: 'xxx'
			}
		}
	}
};

const validationModel = {
	'user.data.name': {
		message: 'Name is required',
		validators: [
			{
				validator: ValidatorStringRequired
			}
		]
	},
	'user.data.contacts.email': {
		message: 'Invalid contact email',
		validators: [
			{
				validator: ValidatorEmail
			}
		]
	},
	'user_info': {
		message: 'User info data is incorrect',
		postvalidator: (_, result) => {
			return countErrorsLike('user.data', result) === 0;
		}
	}
};

describe('Aggregate compound validation + helpers', () => {
	test('should call for postprocessing and add error', () => {
		const result = ValidationEngine.validate(BadData, validationModel);

		expect(result.level).toBe('error');

		expect(result.stats.processed_rules).toBe(3);
		expect(result.stats.total_errors).toBe(3);
		expect(result.stats.total_notices).toBe(0);
		expect(result.stats.total_skipped).toBe(0);
		expect(result.stats.total_warnings).toBe(0);
	});
});

describe('Total calculation', () => {
	test('should calculate errors', () => {
		const result = ValidationEngine.validate(BadData, {
			'user.data.name': {
				message: 'Name is required',
				validators: [
					{
						validator: ValidatorStringRequired,
					},
					{
						message: 'Custom error-1',
						validator: () => false,
					},
					{
						message: 'Custom error-2',
						validator: () => false,
					}
				]
			}
		});

		expect(result.level).toBe('error');

		expect(result.stats.processed_rules).toBe(1);
		expect(result.stats.total_errors).toBe(3);
		expect(result.stats.total_notices).toBe(0);
		expect(result.stats.total_warnings).toBe(0);
		expect(result.stats.total_skipped).toBe(0);
	});

	test('should calculate warnings', () => {
		const result = ValidationEngine.validate(BadData, {
			'user.data.name': {
				message: 'Name is required',
				level: 'warning',
				validators: [
					{
						validator: ValidatorStringRequired,
					},
					{
						message: 'Custom error-1',
						validator: () => false,
					},
					{
						message: 'Custom error-2',
						validator: () => false,
					}
				]
			}
		});

		expect(result.level).toBe('warning');

		expect(result.stats.processed_rules).toBe(1);
		expect(result.stats.total_errors).toBe(0);
		expect(result.stats.total_notices).toBe(0);
		expect(result.stats.total_warnings).toBe(3);
		expect(result.stats.total_skipped).toBe(0);
	});

	test('should calculate notices', () => {
		const result = ValidationEngine.validate(BadData, {
			'user.data.name': {
				message: 'Name is required',
				level: 'notice',
				validators: [
					{
						validator: ValidatorStringRequired,
					},
					{
						message: 'Custom error-1',
						validator: () => false,
					},
					{
						message: 'Custom error-2',
						validator: () => false,
					}
				]
			}
		});

		expect(result.level).toBe('notice');

		expect(result.stats.processed_rules).toBe(1);
		expect(result.stats.total_errors).toBe(0);
		expect(result.stats.total_notices).toBe(3);
		expect(result.stats.total_warnings).toBe(0);
		expect(result.stats.total_skipped).toBe(0);
	});

	test('should calculate everything', () => {
		const result = ValidationEngine.validate(BadData, {
			'user.data.name': {
				message: 'Name is required',
				validators: [
					{
						level: 'notice',
						validator: ValidatorStringRequired,
					},
					{
						level: 'warning',
						message: 'Custom error-1',
						validator: () => false,
					},
					{
						level: 'error',
						message: 'Custom error-2',
						validator: () => false,
					}
				]
			}
		});

		expect(result.level).toBe('error');

		expect(result.stats.processed_rules).toBe(1);
		expect(result.stats.total_errors).toBe(1);
		expect(result.stats.total_notices).toBe(1);
		expect(result.stats.total_warnings).toBe(1);
		expect(result.stats.total_skipped).toBe(0);
	});
});
