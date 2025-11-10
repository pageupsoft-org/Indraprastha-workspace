import { FormControl } from '@angular/forms';

export interface IMRegister {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  contact: FormControl<string | null>;
  userName: FormControl<string | null>;
  password: FormControl<string | null>;
}

export interface IRRegister {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  userName: string;
  password: string;
}
