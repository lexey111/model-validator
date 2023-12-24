import {describe, expect, test} from '@jest/globals';
import {ValidationEngine} from "../../src/engine/validation-engine";
import {ValidatorEmail} from "../../src/validators/validator-email";

const data = {
	user: {
		data: {
			name: 'John',
			surname: 'Doe',
			contacts: {
				email: 'xxx'
			}
		}
	}
};

const validationModel = {
	'user.data.contacts.email': {
		message: 'Invalid contact email',
		validators: [
			{
				validator: ValidatorEmail
			}
		]
	},
};

describe('Aggregate compound validation', () => {
	test('should fail with valid data', () => {
		const result = ValidationEngine.validate(data, validationModel);

		expect(result.level).toBe('error');

		expect(result.stats.processed_rules).toBe(1);
		expect(result.stats.total_errors).toBe(1);
		expect(result.stats.total_notices).toBe(0);
		expect(result.stats.total_skipped).toBe(0);
		expect(result.stats.total_warnings).toBe(0);
	});

});
