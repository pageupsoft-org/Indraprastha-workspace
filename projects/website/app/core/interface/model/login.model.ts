import { FormControl } from '@angular/forms';

export interface IMLogin {
  userName: FormControl<string | null>;
  password: FormControl<string | null>;
}

export interface IDLogin {
  userName: string;
  password: string;
}