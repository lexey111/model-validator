import {describe, expect, test} from '@jest/globals';
import {ValidatorStringRequired} from '../../src/validators/validator-string-required';
import {ValidationEngine} from '../../src/engine/validation-engine';
import {ValidatorArrayLength} from '../../src/validators/validator-array-length';

describe('Validate iterators field', () => {
	test('should perform validation with nested fields', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				values: [
					{name: 'value 1', data: ''},
					{name: 'value 2', data: undefined},
					{name: 'value 3', data: 'some data'},
					{name: 'value 4', data: []},
				]
			},
			{
				'values[].data': {
					validators: [
						{
							validator: ValidatorStringRequired,
							message: 'Data value is required'
						}
					]
				},
			}
		);

		expect(result.level).toBe('error');
		expect(result.stats.processed_rules).toBe(4);
		expect(result.stats.total_errors).toBe(3);
		expect(result.stats.total_notices).toBe(0);
		expect(result.stats.total_skipped).toBe(0);
		expect(result.stats.total_warnings).toBe(0);

		expect(result.errors['values[0].data'].length).toBe(1);
		expect(result.errors['values[0].data'][0]).toBe('Data value is required');
		expect(result.errors['values[1].data'].length).toBe(1);
		expect(result.errors['values[1].data'][0]).toBe('Data value is required');
		expect(result.errors['values[3].data'].length).toBe(1);
		expect(result.errors['values[3].data'][0]).toBe('Data value is required');
	});

	test('should perform validation with nested-nested fields', () => {
		const result = ValidationEngine.validate(
			{
				name: 'John',
				personal: {
					values: [
						{name: 'A', values: [{title: 'A1', tags: ['A', 'B', 'C']}, {title: 'A2', tags: []}]},
						{name: 'B', values: [{title: 'B1', tags: []}, {title: 'B2', tags: ['B']}]},
						{name: 'C', values: [{title: 'C1', tags: []}, {title: 'C2', tags: []}, {title: 'C3', tags: []}]}
					]
				}
			},
			{
				'personal.values[].values[].tags': {
					validators: [
						{
							validator: ValidatorArrayLength,
							params: {min: 1},
							message: 'Tags cannot be empty'
						}
					]
				},
			}
		);

		expect(result.level).toBe('error');
		expect(result.stats.processed_rules).toBe(7);
		expect(result.stats.total_errors).toBe(5);
		expect(result.stats.total_notices).toBe(0);
		expect(result.stats.total_skipped).toBe(0);
		expect(result.stats.total_warnings).toBe(0);


		expect(result.errors['personal.values[0].values[1].tags'].length).toBe(1);
		expect(result.errors['personal.values[0].values[1].tags'][0]).toBe('Tags cannot be empty');

		expect(result.errors['personal.values[1].values[0].tags'].length).toBe(1);
		expect(result.errors['personal.values[1].values[0].tags'][0]).toBe('Tags cannot be empty');

		expect(result.errors['personal.values[2].values[0].tags'].length).toBe(1);
		expect(result.errors['personal.values[2].values[0].tags'][0]).toBe('Tags cannot be empty');
		expect(result.errors['personal.values[2].values[1].tags'].length).toBe(1);
		expect(result.errors['personal.values[2].values[1].tags'][0]).toBe('Tags cannot be empty');
		expect(result.errors['personal.values[2].values[2].tags'].length).toBe(1);
		expect(result.errors['personal.values[2].values[2].tags'][0]).toBe('Tags cannot be empty');
	});
});
