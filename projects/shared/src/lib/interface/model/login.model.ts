import { FormControl } from '@angular/forms';

export interface ILoginForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  fcmToken: FormControl<string | null>;
}

export interface ILoginFormData {
  username: string;
  password: string;
  fcmToken: string;
}