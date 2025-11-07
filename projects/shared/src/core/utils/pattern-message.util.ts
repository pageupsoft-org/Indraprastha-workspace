import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function patternWithMessage(pattern: RegExp, message: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }
        return pattern.test(control.value)
            ? null
            : { pattern: { message } };
    };
}