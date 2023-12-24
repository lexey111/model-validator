export type TValidatorFnResult = boolean | undefined // true - ok, false - violated, undefined - not applicable, skip

export type TValidatorFn = (value: any, params?: Record<string, any>, data?: any) => TValidatorFnResult

export type TValidatorMessage = string | ((data: any, value: any) => string)

export interface IValidator {
	validator: TValidatorFn
	level?: TValidationViolationLevel // default error
	message?: TValidatorMessage
	params?: Record<string, any>
}

export type TValidationViolationLevel = 'unknown' | 'none' | 'notice' | 'warning' | 'error'

export type TValidationRule = {
	level?: TValidationViolationLevel // default 'error'
	message?: TValidatorMessage
	active?: boolean | ((data: any, value: any) => boolean) // default true
	validators?: Array<IValidator>
}

export type TValidationModel = Record<string, TValidationRule>;

export type TViolation = Record<string, Array<string>>

export type TValidationResult = {
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

export interface IValidationEngine {
	validate: (data: Record<string, any>, model: TValidationModel) => TValidationResult
}
