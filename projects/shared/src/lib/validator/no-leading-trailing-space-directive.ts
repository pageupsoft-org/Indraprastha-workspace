import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[libNoLeadingTrailingSpaceDirective]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useClass: NoLeadingTrailingSpaceDirective,
      multi: true,
    },
  ],
})
export class NoLeadingTrailingSpaceDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') return null;
    if (value.trim() !== value) {
      return { leadingOrTrailingSpace: true };
    }

    return null;
  }
}
