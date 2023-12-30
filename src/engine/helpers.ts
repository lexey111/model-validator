import {TValidationResult} from "./validation-types";

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
