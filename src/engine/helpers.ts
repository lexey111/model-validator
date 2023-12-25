import {TValidationResult} from "./validation-types";

export function countErrorsLike(key: string, result: TValidationResult): number {
	return Object.keys(result.errors).filter(errorPath => errorPath.indexOf(key) !== -1).length;
}

export function countWarningsLike(key: string, result: TValidationResult): number {
	return Object.keys(result.warnings).filter(warningPath => warningPath.indexOf(key) !== -1).length;
}

export function countNoticesLike(key: string, result: TValidationResult): number {
	return Object.keys(result.notices).filter(noticePath => noticePath.indexOf(key) !== -1).length;
}
