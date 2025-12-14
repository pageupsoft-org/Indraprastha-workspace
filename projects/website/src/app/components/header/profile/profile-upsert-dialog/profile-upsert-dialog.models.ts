import { FormControl, FormGroup, Validators } from '@angular/forms';
import { patternWithMessage } from '@shared';

export interface IProfileForm {
  id: FormControl<number | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  contact: FormControl<string | null>;
}

export const initializeProfileForm = (): FormGroup<IProfileForm> =>
  new FormGroup<IProfileForm>({
    id: new FormControl<number | null>(null),
    firstName: new FormControl<string | null>(null, [
      Validators.required,
      patternWithMessage(/^\S(.*\S)?$/, 'starting and ending space not allowed'),
      Validators.minLength(3),
      Validators.maxLength(15),
      patternWithMessage(/^[A-Za-z0-9]+$/, 'This field not allowed any space'),
      patternWithMessage(/^[A-Za-z ]*$/, 'No special characters and number allowed'),
    ]),
    lastName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
      patternWithMessage(/^[A-Za-z0-9]+$/, 'This field not allowed any space'),
      patternWithMessage(/^[A-Za-z ]*$/, 'No special characters and number allowed'),
    ]),
    email: new FormControl<string | null>(null, [
      Validators.required,
      patternWithMessage(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Enter a valid email address'
      ),
    ]),
    contact: new FormControl<string | null>(null, [
      Validators.required,
      patternWithMessage(/^[6-9]\d{9}$/, 'Enter a valid contact number.'),
    ]),
  });

export interface IProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  isLogin: boolean;
  isActive: boolean;
  email: string;
  contact: string;
}

export interface IProfilePayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
}
