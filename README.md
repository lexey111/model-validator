# Model Validator

### TL;DR

Backend-like (but applicable on both frontend and backend) validation, where you have data ("model"), a validation model ("validation model"), and an engine that will execute the validation model on the data and then return the result. 

The results are divided into three states: "error", "warning" and "notice", which are declared for each "validator" (elementary checking function) or "rule" (set of validators).

This is a simplified version of the validation engine, supporting only synchronous validation and using simplified syntax.

#### Installation:

`npm i -D lx-model-validator`

#### Useful resources

[Demo page](https://lexey111.github.io/home)

[Helper functions](HELPERS.md)

## Documentation

This small package is designed for model-level validation of JS/TS projects.

What does "model-level" mean? It's simple.

Usually, various frameworks like React, Angular or other have components and "component-level" granularity of a validation.

It means, we have a data _model_ like

```js
const UserData = {
	personalData: {
		name: 'John',
		surname: 'Doe'
	},
	contacts: [
		{type: 'email', value: 'johndoe@mail.com', default: true},
		{type: 'cellular', value: '+5500123456678'},
		{type: 'work-phone', value: '+55006543210'}
	],
	preferences: {
		colorTheme: 'dark',
		volume: 60,
	}
}
```

We are storing this data somewhere, in a _service_, in a _store_, in some _context_. And, then, we are displaying these values by different components:

```typescript jsx
export const PersonalData: React.FC = ({data: UserData}) => {
	// Some code to determine if there any error
	return <fieldset>
		<div className={'some_code_to_reflect_the_error_state'}>
			<label for="user_name">Name</label>
			<input type="text"
			       name="user_name"
			       value={data.name}
			       onChange={(e) => changeData('name', e.target.value)}
			/>
			{/* Some error message(s) for the field */}
		</div>

		<div className={'some_code_to_reflect_the_error_state'}>
			<label for="user_surname">Name</label>
			<input type="text"
			       name="user_surname"
			       value={data.surname}
			       onChange={(e) => changeData('surname', e.target.value)}
			/>
			{/* Some error message(s) for the field */}
		</div>
	</fieldset>;
}
```

And for sure, we need to validate data before submitting the form.

With _component granularity_, we have to add such validations for every single field at the component level. We have to take care of `user.personalData.name`, `user.contacts` and every field we need to validate.

Then we need to check the overall state before sending. And then - check the transmitted data again, on the server side.

There are plenty of libraries we can use to simplify the process: e.g., Formik. But anyway, there –

* We will have validation at the field level, and we need to aggregate it somehow. In other words, we have 3 "dumb" components that map to a common model, and each component has its own validation, and you need some way to check if the "Submit" button should be disabled.

* Or we can have a "smart" container component (or _store_ or _service_) and more "dumb" view components, and then share the validation state as `props`. This is closer to the `model level`.

With model-level validation we have one, single `data model`, one, single `data validation model` and one, single `validation check result`.

## Model-level validation

Model-level validation means that we have a special entity, the _validation model_, that describes how to validate a particular _model_, and a _validation engine_ that performs that validation.

```js
const UserValidation = {
	'personalData.name': {
		validators: [
			{
				validator: ValidatorStringRequired,
				message: 'Name is required'
			}, {
				validator: ValidatorStringLength,
				params: {min: 2, skipIfEmpty: true},
				message: 'At least 2 characters, please'
			}
		]
	},
	'personalData.surname': {
		level: 'warning',
		validators: [
			{
				validator: ValidatorStringRequired, message: 'Please provide your Surname'
			},
		]
	},
	'contacts_aggregate': {
		validators: [
			{
				validator: ValidatorArrayLength,
				params: {min: 1},
				message: 'Please provide at least one contact'
			}
		]
	},
	'user_aggregate': {
		message: 'User data is invalid',
		postvalidator: (_, result) => {
			return (countErrorsLike('personalData', result) +
				countErrorsLike('contacts', result)) === 0;
		}
	}
}
```

Here we can reach the consistency between model and state, and have a single source of truth:

```js
const result = ValidationEngine.validate(UserData, UserValidation);
```

```
{
	state: 'completed',
	level: 'none',
	stats: {
		started_at: '...',
		finished_at: '...',
		time: 0.32,
		processed_rules: 4,
		processed_validators: 4,
		total_errors: 0,
		total_warnings: 0,
		total_notices: 0,
		total_skipped: 0
	},
	errors: {},
	warnings: {},
	notices: {},
	skipped: []
}
```

Or, with empty `name` field:

```
{
	state: 'completed',
	level: 'error',
	stats: {
		started_at: '...',
		finished_at: '...',
		time: 0.37766699492931366,
		processed_rules: 4,
		processed_validators: 4,
		total_errors: 2,
		total_warnings: 0,
		total_notices: 0,
		total_skipped: 1
	},
	errors: {
		'personalData.name': ['Name is required'],
		'user_aggregate': ['User data is invalid']
	},
	warnings: {},
	notices: {},
	skipped: []
}
```

All we need now to do is display the messages in appropriate place, and disable the "Submit" button.

It's a bit like a state management architecture: instead of getting data, then decomposing it into pieces and binding it to a component by going through a tree of nested components, we have a single context that is available everywhere.

This is a centralized solution where the developer has full control over performing validation, retrieving results and displaying state. The state is completely separate from the view, but is highly optimized for use in the UI.

Due to the fact that the solution is framework-independent, we can run the same validation model on both client and server side. Moreover, we can keep the validation models on server and load them on-demand to the client, or construct the validation models on the fly.

And, of course, with this approach we can get very convenient unit testing and even create our own test automation framework (e.g., a set of data that should pass, a set of data that should fail, and an automated run).

## Usage

Well, first we need to declare validation model. It is pretty simple, just a JS (TS) structure of _rules_:

```ts
const ValidationModel = {
	'path.in.model': {
		message: 'Optional message', // otherwise result will be a message from validator
		level: 'error', // optional, 'error', 'warning', 'notice',
		active: true, // true|false or (data, value) => boolean
		validators: [/* array of validators... */],
		postvalidator: (data, result) => true // ...or special post-validation function 
	},
	'other.path.in.model': {}
}
```

Result of validations is a special structure which includes `errors`, `warnings` and `notices` data according to the levels of violation for each validator:

```
...
errors: {
    
    'personalData.name': ['Name is required'],
    user: ['User data is invalid']
}
```

Here we have:

1) `path.in.model` means, suddenly, a path in the model. Like `personalData.name`. Very usual dot-separated JS notation.
    Valid paths: `user.data.personal.name`, `user.contacts[]`, `user.contacts[0].type`, `user.contacts*.value`.

   As you can see, in addition to direct addressing, there is array addressing: `contacts[]` means the entire array (for statements like "must have at least one element"), `contacts[0]` means the first element in the array, `contacts[*]` means "for every element in the array".

2) `message`. Validation engine supports 3 level of messaging, in order: 

3) `level` means 'violation level' and could be `unknown` -> `none` -> `notice` -> `warning` -> `error`.
    `unknown` means validation wasn't completed, `none` - there are no errors at all.

4) `active` controls the rule execution. It could be a static boolean value, or a function that return boolean.

    With `false` rule will be ignored.

5) `validators` field is the most interesting. `validator` is the function which receives a value (by `path.in.the.model`), optional `params` and returns `true`, `false` or `undefined`.

    Here `true` means 'validation passed, no error', `false` – 'validation failed' and `undefined` – 'validation skipped for some reason'.
    The last one, `undefined`, is very important for cases like 'Password is required' + 'Min length is 8 characters': it makes no sense to output both messages to an empty field, so most validators include the `skipIfEmpty` option, which allows you to bypass further validation as long as there is no value.  

6) `postvalidator` is a special thing for _aggregates_ (see below).

### Validators
Validator is the function which receives a value, some options and returns the result of validation:

* `true` for passed, no error,
* `false` for violation,
* `undefined` if unknown state (e.g., invalid datatype), or if validation skipped by some reason ('undefined' value with `skipIfEmpty===true`)

The signature:
```ts
type TValidatorFnResult = boolean | undefined // true - ok, false - violated, undefined - not applicable, skip

type TValidatorFn = (value: any, params?: Record<string, any>, data?: any) => TValidatorFnResult

type TValidatorMessage = string | ((data: any, value: any) => string)
```

and

```ts
interface IValidator {
	validator: TValidatorFn
	level?: TValidationViolationLevel // default error
	message?: TValidatorMessage
	params?: Record<string, any>
}
```

And all together:
```js
const UserValidation = {
	'personalData.name': {
		validators: [
			{
				validator: ValidatorStringRequired,
				message: 'Name is required'
			}, {
				validator: ValidatorStringLength,
				params: {min: 2, skipIfEmpty: true},
				message: 'At least 2 characters, please'
			}
		]
	},
}
```

Here we do have two validators, `ValidatorStringRequired` and `ValidatorStringLength` – both predefined – with static messages and default `level`: error.

Regarding the `message` field. The validation engine uses it from the validator or from the parent rule to calculate the text for the associated violation. It could be a static string, or a function:

```ts
type TValidatorMessage = string | ((data: any, value: any) => string)
```

This means that you can use the "functional" syntax if you need, for example, __i18n__ for messages at this level. In other words, for React apps you can provide –

```ts
{
    validator: ValidatorStringRequired,
    message: i18n('UserProfile__Name_is_required')
}
```

and for Angular –
```ts
{
    validator: ValidatorStringRequired,
    message: 'UserProfile__Name_is_required'
}
...
// somewhere in the markup:
{{ message | i18n }}
```

### Predefined validators

The project includes 7 predefined validators. More complex or specific validators can be implemented manually using examples.

#### ValidatorStringRequired

Checks for the presence of a string. The declaration:

```ts
function ValidatorStringRequired(str: string, params?: {allowWhitespaces?: boolean}): TValidatorFnResult...
```

The only optional param is `allowWhitespaces`, default `false`. Without `allowWhitespaces === true` such strings as '    ', '\t', '\r', etc. will return error.

#### ValidatorStringContains

Checks for the presence of a substring in a string. The declaration:

```ts
function ValidatorStringContains(str: string, params: {
	searchString: string,
	skipIfEmpty?: boolean,
	caseSensitive?: boolean
}): TValidatorFnResult...
```

There is one mandatory parameter `searchString`, and two optional parameters `skipIfEmpty` and `caseSensitive`.

#### ValidatorStringLength

Checks the minimum, or maximum, or both lengths for the given string.

```ts
function ValidatorStringLength(str: string, params: {
	min?: number,
	max?: number,
	skipIfEmpty?: boolean,
	trim?: boolean
}): TValidatorFnResult...
```

Here:
* `min` - the `str` must be at least 'min' in length (inclusive), 
* `max` - the `str` must be no longer than `max` (inclusive), 
* both - length must be between min to max (inclusive),
* `trim` (default is `false`) means that the string will be trimmed first before validation, removing leading and trailing spaces,
* `skipIfEmpty` (default is `false`) - skip the check if string is empty.

#### ValidatorStringPattern

Check if the string matches given pattern (regexp):

```ts
function ValidatorStringPattern(str: string, params: {
	pattern: RegExp,
	skipIfEmpty?: boolean,
}): TValidatorFnResult...
```

Here:
* `pattern` – RegExp to test, e.g., `{pattern: /abc\d+def/i}` 
* `skipIfEmpty` (default is `false`) - skip the check if the given string is empty.

#### ValidatorEmail

Pretty obvious, checks to see if the string contains a valid email address.

```ts
function ValidatorEmail(email: string, params: {
	skipIfEmpty?: boolean,
}): TValidatorFnResult...
```

The only parameter here, `skipIfEmpty`, determines whether the validator should test empty strings.

Technically it is a pattern validator but with predefined pattern.

#### ValidatorNumberRange

Checks the given number whether it is in the range or not.

```ts
function ValidatorNumberRange(num: number, params: {
	min?: number,
	max?: number,
	skipIfEmpty?: boolean
}): TValidatorFnResult...
```

Here:
* `min` - the `num` must be at least 'min' (inclusive),
* `max` - the `num` must be no greater than `max` (inclusive),
* both - must be between min to max (inclusive),
* `skipIfEmpty` (default is `false`) - skip the check if `num` is `undefined`.

#### ValidatorArrayLength

Simple validator like `ValidatorStringLength` but for arrays:

```ts
function ValidatorArrayLength(data: Array<any>, params: {
	min?: number,
	max?: number,
	skipIfEmpty?: boolean
}): TValidatorFnResult...
```
Here:
* `min` - the size of `data` array must be at least 'min' (inclusive),
* `max` - the size of `data` array must be no greater than `max` (inclusive),
* both - size of `data` array must be between min to max (inclusive),
* `skipIfEmpty` (default is `false`) - skip the check if `data` size equals `0` (empty array).

## Validation result

The result of a validation session is a data structure:
```js
result = {
	state: 'completed',
	level: 'none',
	stats: {
		started_at: '...',
		finished_at: '...',
		time: 0.3203750103712082,
		processed_rules: 4,
		processed_validators: 4,
		total_errors: 0,
		total_warnings: 0,
		total_notices: 0,
		total_skipped: 0
	},
	errors: {},
	warnings: {},
	notices: {},
	skipped: []
}
```

The most interesting fields here are:
* `level` - overall level of violation,
* `errors`, `warnings` and `notices` structures.

First one is quite obvious, `level` means 'violation level' and could be `unknown` -> `none` -> `notice` -> `warning` -> `error`.
`unknown` means validation wasn't completed, `none` - there are no errors at all.

The rest of fields are `TViolation`:

```ts
type TViolation = Record<string, Array<string>>
```

Or, in data terms,

```ts
...
level: 'error',
errors: {
	'user.personal.data.name': ['Name is required'],
	'user.personal.data.surname': ['Minimal length is 4 characters', 'Should include "Addams"']
},
warnings: {
	'user.avatar': ['Please upload an picture'], 
    'contacts[0].zip': ['First address should include ZIP code']
}
...
```

As you can see, the same `path.in.the.model` addressing is present here, where each address can have one or more associated messages of three different levels.

The validation engine runs the validator, and if there is a violation (returns `false`) - it puts the associated message into the corresponding structure (pushes it into an array).

_Corresponding_ determined by the `level` of validator, or of the rule, or 'error', if nothing.

_Message_ calculates as a message from the validator, or from the rule, or automatic as 'Empty message, %path%'.

#### Skipped

`skipped` is a technical field (array) of rules that were skipped during validation because they are invalid (non-existent path, invalid rule declaration). E.g., if in model we have `form.user.data` field but in the validation model we have declared a rule with `form.users.data`, this rule will be placed to the `skipped` array as a `form.users.data, users` because `form` does not have a field `users`.

It is recommended to check `stats.total_skipped` and the contents of the `skipped` field while debugging. It may not be a bug if some rules were put there, depends on the model and rules, but it is better to double-check.

An example of a valid rule that may be missing but that is not an error:

```ts
'user.contacts[1]': {
	validators: [ValidatorEmail]
}
```

It will legally put to `skipped` while we have only one element in `contacts`, and this is OK if we have the phone number for the first item, and optional email for second.

### Aggregates

All of the above validators are granular, at the field level. This is usually sufficient because the user can check the overall result and create _derived validators_.

For example, we might want a user check: if any of the `personalData` fields has a violation, then the entire `user` subset should have an error associated with it. 

Or if there is no `address` in the `contacts` marked as `default` - `contactData` should be marked as 'error'.

To make a life a bit easier, there is so-called _aggregates_, or _postvalidators_ – a special kind of validation rule which is executed _after_ all the 'normal' validators and has access to the current state of validation result:

```ts
...
'user_info_aggregate': {
	level: 'warning',
	message: 'User info data is incorrect',
    postvalidator: (_, result) => {
		return countErrorsLike('user.data', result) === 0;
	}
},
...
'contacts_aggregate': {
	message: 'There must be "default" address',
	postvalidator: (data, result) => {
		return !!data.contacts?.some(record => record.default === true);
	}
}
```

There are some helpers functions available:

* `countErrorsLike`,
* `countWarningsLike`,
* `countNoticesLike`.

They receive the `key` (string) and `result` of the check and return a number of corresponding results (errors, warnings, notifications) that correspond to the passed key:

```ts
export function countErrorsLike(key: string, result: TValidationResult): number {
	return Object.keys(result.errors).filter(errorPath => errorPath.indexOf(key) !== -1).length;
}
```

Very simple but useful.
