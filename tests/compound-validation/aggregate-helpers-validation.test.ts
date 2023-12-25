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
