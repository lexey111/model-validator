# Model Validator

This small package is designed for model-level validation of JS/TS projects.

What does "model-level" mean? It's simple.

Usually, various frameworks like React, Angular or other frameworks have components and "component" granularity.

It means, we have a data _model_ like

```js
const UserData = {
	personalData: {
		name: 'John',
		surname: 'Doe'
	},
	contacts: [
		{type: 'email', value: 'johndoe@mail.com', default: true},
		{type: 'cellular', value: '8500123456678'},
		{type: 'work-phone', value: '85006543210'}
	],
	preferences: {
		colorTheme: 'dark',
		volume: 60,
	}
}
```

and so on.

We are storing this data somewhere, in a _service_, in a _store_, in some _context_. And, then, we are displaying these values by different components:

```typescript jsx
export const PersonalData:React.FC = ({data: UserData}) => {
	return <fieldset>
        <label for="user_name">Name</label>
        <input type="text"
               name="user_name"
               value={data.name}
               onChange={(e) => changeData('name', e.target.value)}
        />

        <label for="user_surname">Name</label>
        <input type="text"
               name="user_surname"
               value={data.surname}
               onChange={(e) => changeData('surname', e.target.value)}
        />
    </fieldset>;
}
```

For sure, we need to validate data before submitting the form.

And with _component granularity_, we have to add such validation for every field at the component level. We have to take care of `user.personalData.name`, `user.contacts` and every field we need to validate.

There are plenty of libraries we can use to simplify the process: e.g., Formik. But anyway, there –

* We will have validation at the field level, and we need to aggregate it somehow. In other words, we have 3 "dumb" components that map to a common model, and each component has its own validation, and you need some way to check if the "Submit" button should be disabled.
* We can have a "smart" container component (or _store_ or _service_) and more "dumb" view components, and then share the validation state as `props`. This is closer to the `model level`.

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
	'contacts': {
		validators: [
			{
				validator: ValidatorArrayLength,
				params: {min: 1},
				message: 'Please provide at least one contact'
			}
		]
	},
	'user': {
		message: 'User data is invalid',
		postvalidator: (_, result) => {
			return (countErrorsLike('personalData', result) +
				countErrorsLike('contacts', result)) === 0;
		}
	}
}
```

Here we can get consistency between model and state, a single source of truth:

```js
const result = ValidationEngine.validate(UserData, UserValidation);
```

```js
{
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

Or, with empty `name` field:

```js
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
		user: ['User data is invalid']
	},
	warnings: {},
	notices: {},
	skipped: []
}
```

## Usage principles

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

```ts
...
errors: {
    
    'personalData.name': ['Name is required'],
    user: ['User data is invalid']
}
```

Here we have:

1) `path.in.model` means, suddenly, a path in the model. Like `personalData.name`. Very usual dot-separated JS notation.
    Valid paths: `user.data.personal.name`, `user.contacts`, `user.contacts[0].type`, `user.contacts[].value`.

   As you can see, in addition to direct addressing, there is array addressing: `contacts[]` means the entire array (for statements like "must have at least one element"), `contacts[0]` means the first element in the array, `contacts[]` means "for every element in the array".

2) `message`. Validation engine supports 3 level of messaging, in order: 
