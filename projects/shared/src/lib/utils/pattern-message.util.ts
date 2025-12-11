import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function patternWithMessage(pattern: RegExp, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = control.value;

    // If empty/null → valid
    if (rawValue === null || rawValue === undefined || rawValue === '') {
      return null;
    }

    const value = String(rawValue).trim(); 

    return pattern.test(value) ? null : { pattern: { message } };

  };
}
