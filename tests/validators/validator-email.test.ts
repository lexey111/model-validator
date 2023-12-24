import {describe, expect, test} from '@jest/globals';
import {ValidatorEmail} from "../../src/validators/validator-email";

describe('Validator for emails', () => {
	test('should pass on valid emails', () => {
		[
			'aaa@aaa.com',
			'a@a.com',
			'a+b@a.com',
		].forEach(str => {
			const result = ValidatorEmail(str);
			expect(result).toBe(true);
		});
	});

	test('should fail on invalid emails', () => {
		[
			'mysite.ourearth.com', // [@ is not present]
			'mysite@.com.my', // [ tld (Top Level domain) can not start with dot "." ]
			'@you.me.net', // [ No character before @ ]
			'mysite123@gmail.b', // [ ".b" is not a valid tld ]
			'mysite@.org.org', // [ tld can not start with dot "." ]
			'.mysite@mysite.org', // [ an email should not be start with "." ]
			'mysite()*@gmail.com', // [ here the regular expression only allows character, digit, underscore, and dash ]
			'mysite..1234@yahoo.com' //  [double dots are not allowed]
		].forEach(str => {
			const result = ValidatorEmail(str);
			expect(result).toBe(false);
		});
	});

	test('should fail on empty string', () => {
		const result = ValidatorEmail('');
		expect(result).toBe(false);
	});

	test('should return undefined on invalid string', () => {
		const result = ValidatorEmail(42);
		expect(result).toBeUndefined();
	});

	test('should fail on undefined string', () => {
		const result = ValidatorEmail(undefined);
		expect(result).toBe(false);
	});

	test('should return undefined on empty string skipIfEmpty === true', () => {
		const result = ValidatorEmail('', {skipIfEmpty: true});
		expect(result).toBeUndefined();
	});

	test('should return undefined on undefined string skipIfEmpty === true', () => {
		const result = ValidatorEmail(undefined, {skipIfEmpty: true});
		expect(result).toBeUndefined();
	});

});
