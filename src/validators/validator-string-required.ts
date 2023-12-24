import type { TValidatorFn } from '../engine/validation-types';

export const ValidatorStringRequired: TValidatorFn = (str: string, params?: {allowWhitespace?: boolean}) => {
    if (!str) {
        // '', null, undefined, etc.
        return false;
    }

    if (typeof str !== 'string') {
        return false;
    }

    if (params?.allowWhitespace === true) {
        return true;
    }

    return str.replaceAll(/\s/g, '') !== '';
}
