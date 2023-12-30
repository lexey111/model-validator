import {TValidationResult, TValidationViolationLevel} from "./validation-types";

export function countErrorsLike(key: string, result?: TValidationResult, exact = false): number {
	if (!result) {
		return 0;
	}

	if (exact) {
		return result.errors[key]?.length || 0;
	}

	const allKeys = Object.keys(result.errors).filter(errorPath => errorPath.indexOf(key) !== -1);
	return allKeys.reduce((prev, current) => prev + result.errors[current].length, 0);
}

export function countWarningsLike(key: string, result?: TValidationResult, exact = false): number {
	if (!result) {
		return 0;
	}

	if (exact) {
		return result.warnings[key]?.length || 0;
	}

	const allKeys = Object.keys(result.warnings).filter(errorPath => errorPath.indexOf(key) !== -1);
	return allKeys.reduce((prev, current) => prev + result.warnings[current].length, 0);
}

export function countNoticesLike(key: string, result?: TValidationResult, exact = false): number {
	if (!result) {
		return 0;
	}

	if (exact) {
		return result.notices[key]?.length || 0;
	}

	const allKeys = Object.keys(result.notices).filter(errorPath => errorPath.indexOf(key) !== -1);
	return allKeys.reduce((prev, current) => prev + result.notices[current].length, 0);
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


export function hasError(key: string, result?: TValidationResult): boolean {
	if (!result) {
		return false;
	}
	return !!result.errors[key];
}

export function hasWarning(key: string, result?: TValidationResult): boolean {
	if (!result) {
		return false;
	}
	return !!result.warnings[key];
}

export function hasNotice(key: string, result?: TValidationResult): boolean {
	if (!result) {
		return false;
	}
	return !!result.notices[key];
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
