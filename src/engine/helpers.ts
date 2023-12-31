import {TValidationResult, TValidationViolationLevel, TViolation} from "./validation-types";

function countSmthLike(key: string | RegExp, target?: TViolation, exact = false): number {
	if (!target || !key) {
		return 0;
	}
	if (exact && typeof key === 'string') {
		return target[key]?.length || 0;
	}

	let allKeys;

	if (typeof key === 'string') {
		allKeys = Object.keys(target).filter(path => path.indexOf(key) !== -1);
	} else {
		allKeys = Object.keys(target).filter(path => key.test(path));
	}
	return allKeys.reduce((prev, current) => prev + target[current].length, 0);
}

export function countErrorsLike(key: string | RegExp, result?: TValidationResult, exact = false): number {
	return countSmthLike(key, result?.errors, exact);
}

export function countWarningsLike(key: string | RegExp, result?: TValidationResult, exact = false): number {
	return countSmthLike(key, result?.warnings, exact);
}

export function countNoticesLike(key: string | RegExp, result?: TValidationResult, exact = false): number {
	return countSmthLike(key, result?.notices, exact);
}

export function hasErrors(result?: TValidationResult): boolean {
	if (!result) {
		return false;
	}
	return result.stats.total_errors > 0;
}

export function hasWarnings(result?: TValidationResult): boolean {
	if (!result) {
		return false;
	}
	return result.stats.total_warnings > 0;
}

export function hasNotices(result?: TValidationResult): boolean {
	if (!result) {
		return false;
	}
	return result.stats.total_notices > 0;
}

function hasSmth(key: string | RegExp, target?: TViolation): boolean {
	if (!target || !key) {
		return false;
	}

	if (typeof key === 'string') {
		return !!target[key];
	}

	return Object.keys(target).some(str => key.test(str));
}

export function hasError(key: string | RegExp, result?: TValidationResult): boolean {
	return hasSmth(key, result?.errors);
}

export function hasWarning(key: string | RegExp, result?: TValidationResult): boolean {
	return hasSmth(key, result?.warnings);
}

export function hasNotice(key: string | RegExp, result?: TValidationResult): boolean {
	return hasSmth(key, result?.notices);
}

export function getValidationClass(result?: TValidationResult, field?: string, exact = true): TValidationViolationLevel {
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
