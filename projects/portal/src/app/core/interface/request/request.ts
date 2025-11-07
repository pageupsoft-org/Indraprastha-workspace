import { FormControl } from "@angular/forms";

export interface registerForm {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    contact: FormControl<string | null>;
    userType: FormControl<string | null>;
    address: FormControl<string | null>;
    username: FormControl<string | null>;
    password: FormControl<string | null>;
}

export interface registerPayload {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    userType: string;
    address: string;
    username: string | null;
    password: string | null;
}






