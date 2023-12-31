# Helper functions

The **Model Validator** project contains many helper functions that can be imported, such as:

```ts
import {
	hasError,
	hasWarning,
	hasNotice,
	hasErrors,
	hasWarnings,
	hasNotices,
	countErrorsLike,
	countWarningsLike,
	countNoticesLike,
	getValidationClass
} from 'model-validator';
```

Let's begin.

## TValidationResult

This is the basic structure that describes the result of the check. All helpers use it to process.

```ts
type TViolation = Record<string, Array<string>>

type TValidationViolationLevel = 'unknown' | 'none' | 'notice' | 'warning' | 'error'

type TValidationResult = {
	state: 'unknown' | 'completed' | 'internal error'
	level: TValidationViolationLevel // max level of violation
	error?: string // the reason why validation was not completed
	stats: {
		started_at: Date
		finished_at: Date
		time: number
		processed_rules: number
		processed_validators: number
		total_errors: number
		total_warnings: number
		total_notices: number
		total_skipped: number
	},
	errors: TViolation,
	warnings: TViolation,
	notices: TViolation,
	skipped: Array<string>
}
```

The most interesting things here are `stats.total_*` and `errors`, `warnings`, etc.

## hasErrors, hasWarnings, hasNotices

Such functions just check the `total_*` field:


```ts
function hasErrors(result?: TValidationResult): boolean {
	if (!result) {
		return false;
	}
	return result.stats.total_errors > 0;
}
```
This set of function receives:

* `result` to process.

> These functions are used to check the **presence of violations**. Just to check is there _any_ of them.

## hasError, hasWarning, hasNotice

In distinction of `hasErrorS` functions, this set checks "targeted" violation. In other words, they check not `total_errors` but `errors` field.

```ts
function hasError(key: string | RegExp, result?: TValidationResult): boolean {
	...
}
```

This set of function receives:

* `key` which can be a `string` or `RegExp`,
* `result` to process.

When key is a string, it checks is there any `errors[key]` record.

Such functions used to check, e.g., is there `user.personalData.name` error.

key parameter can be a string (exact match) or regexp (any match). For example,

* `'user.personalData.name'` will return `true` for this exact violation, whereas
* `/user\.personal/` will return true if here any error with keys that include "user.personal".

>These functions are very convenient for checking for _aggregation_ violations with `RegExp` and to check for specific violation with a `String`.

## countErrorsLike, countWarningsLike, countNoticesLike

This is a set of functions that targets errors, warnings, and notices and returns the appropriate numbers.

```ts
function countErrorsLike(key: string | RegExp, result?: TValidationResult, exact = false): number {
	...
}
```

The principle of these functions are very similar to `hasErrors`, etc., but they return numbers instead of boolean values. They are a bit more deep, also: whereas `hasErrors` checks just a fact that there any violation with corresponding key, `countErrorsLike` counts how many records has the violated rule.

In other words, for 

```ts
errors = {
    'user.name': ['Field is mandatory', 'Too short', 'Obscene lexic']	
}
```

function `hasErrors('user.name, ...)` returns `true` and `countErrorsLike('user.name, ...)` returns `3`.

Function receives parameters:

* `key` which can be a string of a regexp,
* `result` to check,
* `exact` flag.

The first two parameters are obvious, while the last one requires explanation.

If the `key` is a `string` and `exact` is `false` (default), function will count all the fields which include the key.

If `exact` is set to `true`, the function will count fields whose names are exactly equal to the key.

Example:

```ts
errors = {
    'name': ['Field is mandatory', 'Too short', 'Obscene lexic'],
    'surname': ['Please fill the field']
}
```

* `countErrorsLike('name', ..., false)` === `4` because of 'name' + 'sur**name**'
* `countErrorsLike('name', ..., true)` === `3`, 'name' only.

So, `exact` when `false` could be used as a simplified RegExp pattern matcher.

>These functions are handy for counting the number of errors for some tasks, such as displaying the message "You need to fix 4 errors before submitting the form", or being part of more complex logic.

## getValidationClass

Pretty simple function based on `countErrorsLike` which returns a string based on error state:

```ts
function getValidationClass(result?: TValidationResult, field?: string, exact = true): TValidationViolationLevel {
	if (!result) {
		return "unknown";
	}
	if (!field) {
		return result.level;
	}
	if (countErrorsLike(field, result, exact) > 0) {
		return 'error';
	}
	if (countWarningsLike(field, result, exact) > 0) {
		return 'warning';
	}
	if (countNoticesLike(field, result, exact) > 0) {
		return 'notice';
	}
	return 'none';
}
```

And its usage:

```jsx
<input className={'validation-' + getValidationClass(validationResult, 'name')} ... />
```

Function receives

* `result`
* optional `field` which is the `key`,
* optional `exact` parameter to pass to underlying `countErrorsLike`.

It's just a wrapper with some preset. If there `result` only, the overall validation result will be used (`level`). If there is a `field`, the violation level for that particular field will be checked.


>It is widely used to assign `validation` class to UI controls.
