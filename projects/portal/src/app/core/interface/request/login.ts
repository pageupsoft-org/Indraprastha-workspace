import { FormControl } from "@angular/forms";

export interface loginForm {
    username: FormControl<string | null>;
    password: FormControl<string | null>;
}

export interface loginPayload {
    username: string;
    password: string;
}