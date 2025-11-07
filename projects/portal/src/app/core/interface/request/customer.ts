import { FormControl } from "@angular/forms";

export interface customerForm {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    contact: FormControl<string | null>;
    userName: FormControl<string | null>;
    password: FormControl<string | null>;
}

export interface customerPayload {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    userName: string | null;
    password: string | null;
}