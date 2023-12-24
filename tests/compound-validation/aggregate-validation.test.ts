import {describe, expect, test} from '@jest/globals';
import {ValidationEngine} from "../../src/engine/validation-engine";
import {ValidatorEmail} from "../../src/validators/validator-email";
import {ValidatorStringRequired} from "../../src/validators/validator-string-required";

const data = {
	user: {
		data: {
			name: 'John',
			surname: 'Doe [skip postprocessing]',
			contacts: {
				email: 'xxx'
			}
		}
	}
};

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
		postvalidator: (data, result) => {
			if (data.surName === 'Doe [skip postprocessing]') {
				return undefined;
			}
			// check already existing errors
			let infoErrors = 0;

			Object.keys(result.errors).forEach(errorPath => {
				if (errorPath.indexOf('user.data') !== -1) {
					infoErrors++;
				}
			});

			return infoErrors === 0;
		}
	}
};

describe('Aggregate compound validation', () => {
	test('should fail with invalid data', () => {
		const result = ValidationEngine.validate(data, validationModel);

		expect(result.level).toBe('error');

		expect(result.stats.processed_rules).toBe(3);
		expect(result.stats.total_errors).toBe(2);
		expect(result.stats.total_notices).toBe(0);
		expect(result.stats.total_skipped).toBe(0);
		expect(result.stats.total_warnings).toBe(0);

		expect(result.errors['user.data.contacts.email']).toContain('Invalid contact email');
	});

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
