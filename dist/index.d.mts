type TValidatorFnResult = boolean | undefined;
type TValidatorFn = (value: any, params?: Record<string, any>, data?: any) => TValidatorFnResult;
type TValidatorMessage = string | ((data: any, value: any) => string);
type TPostValidatorFn = (data: any, result: TValidationResult) => TValidatorFnResult;
interface IValidator {
    validator: TValidatorFn;
    level?: TValidationViolationLevel;
    message?: TValidatorMessage;
    params?: Record<string, any>;
}
type TValidationViolationLevel = 'unknown' | 'none' | 'notice' | 'warning' | 'error';
type TValidationRule = {
    level?: TValidationViolationLevel;
    message?: TValidatorMessage;
    active?: boolean | ((data: any, value: any) => boolean);
    validators?: Array<IValidator>;
    postvalidator?: TPostValidatorFn;
};
type TValidationModel = Record<string, TValidationRule>;
type TViolation = Record<string, Array<string>>;
type TValidationResult = {
    state: 'unknown' | 'completed' | 'internal error';
    level: TValidationViolationLevel;
    error?: string;
    stats: {
        started_at: Date;
        finished_at: Date;
        time: number;
        processed_rules: number;
        processed_validators: number;
        total_errors: number;
        total_warnings: number;
        total_notices: number;
        total_skipped: number;
    };
    errors: TViolation;
    warnings: TViolation;
    notices: TViolation;
    skipped: Array<string>;
};
interface IValidationEngine {
    validate: (data: Record<string, any>, model: TValidationModel) => TValidationResult;
}

declare function countErrorsLike(key: string | RegExp, result?: TValidationResult, exact?: boolean): number;
declare function countWarningsLike(key: string | RegExp, result?: TValidationResult, exact?: boolean): number;
declare function countNoticesLike(key: string | RegExp, result?: TValidationResult, exact?: boolean): number;
declare function hasErrors(result?: TValidationResult): boolean;
declare function hasWarnings(result?: TValidationResult): boolean;
declare function hasNotices(result?: TValidationResult): boolean;
declare function hasError(key: string | RegExp, result?: TValidationResult): boolean;
declare function hasWarning(key: string | RegExp, result?: TValidationResult): boolean;
declare function hasNotice(key: string | RegExp, result?: TValidationResult): boolean;
declare function getValidationClass(result?: TValidationResult, field?: string, exact?: boolean): TValidationViolationLevel;

declare const ValidationEngine: IValidationEngine;

declare const ValidatorEmail: TValidatorFn;

declare const ValidatorArrayLength: TValidatorFn;

declare const ValidatorStringLength: TValidatorFn;

declare const ValidatorStringPattern: TValidatorFn;

declare const ValidatorStringContains: TValidatorFn;

declare const ValidatorStringRequired: TValidatorFn;

declare const ValidatorNumberRange: TValidatorFn;

export { type IValidationEngine, type IValidator, type TPostValidatorFn, type TValidationModel, type TValidationResult, type TValidationRule, type TValidationViolationLevel, type TValidatorFn, type TValidatorFnResult, type TValidatorMessage, type TViolation, ValidationEngine, ValidatorArrayLength, ValidatorEmail, ValidatorNumberRange, ValidatorStringContains, ValidatorStringLength, ValidatorStringPattern, ValidatorStringRequired, countErrorsLike, countNoticesLike, countWarningsLike, getValidationClass, hasError, hasErrors, hasNotice, hasNotices, hasWarning, hasWarnings };
