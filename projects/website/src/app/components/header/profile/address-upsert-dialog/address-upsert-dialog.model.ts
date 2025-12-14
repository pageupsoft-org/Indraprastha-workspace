import { FormControl, FormGroup, Validators } from "@angular/forms";
import { patternWithMessage } from "@shared";

export interface IAddresseForm {
  id: FormControl<number | null>;
  country: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  address: FormControl<string | null>;
  apartment: FormControl<string | null>;
  city: FormControl<string | null>;
  state: FormControl<string | null>;
  pinCode: FormControl<number | null>;
  contact: FormControl<string | null>;
  region: FormControl<string | null>;
}

export interface IAddressPayload {
  id: number;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pinCode: number;
  contact: string;
  region: string;
}

export const initializeAddressForm = (): FormGroup<IAddresseForm> =>
  new FormGroup<IAddresseForm>({
    id: new FormControl<number | null>(0),
    country: new FormControl<string | null>(null, [Validators.required]),
    firstName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
    ]),

    lastName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
    ]),
    address: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(70)]),
    apartment: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(70),
    ]),
    city: new FormControl<string | null>(null, Validators.required),
    state: new FormControl<string | null>(null, Validators.required),
    pinCode: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
    contact: new FormControl<string | null>(null, [
      Validators.required,
      patternWithMessage(/^[6-9]\d{9}$/, 'Enter a valid contact number.'),
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    region: new FormControl<string | null>(''),
  });

export interface IAddressPayload {
  id: number;
  address: string;
  state: string;
  city: string;
  pinCode: number;
  email: string;
  contact: string;
  country: string;
  region: string;
  apartment: string;
  firstName: string;
  lastName: string;
}
