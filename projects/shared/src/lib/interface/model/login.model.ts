import { FormControl } from '@angular/forms';

export interface ILoginForm {
  userName: FormControl<string | null>;
  password: FormControl<string | null>;
}

export interface ILoginFormData {
  userName: string;
  password: string;
}