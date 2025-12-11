import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface IProfileForm {
    id: FormControl<number | null>
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    contact: FormControl<string | null>
}

export const initializeProfileForm = (): FormGroup<IProfileForm> =>
    new FormGroup<IProfileForm>({
        id: new FormControl<number | null>(null),
        firstName: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
        lastName: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
        email: new FormControl<string | null>(null, [Validators.required]),
        contact: new FormControl<string | null>(null, Validators.required)
    })

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
    id:number
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
}


export interface IAddresseForm {
    id: FormControl<number | null>
    country: FormControl<string | null>
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    address: FormControl<string | null>;
    apartment: FormControl<string | null>;
    city: FormControl<string | null>;
    state: FormControl<string | null>;
    pinCode: FormControl<number | null>;
    contact: FormControl<string | null>;
    region : FormControl<string | null>;
}

export interface IAddressPayload{
    id:number;
    country:string;
    firstName:string;
    lastName:string;
    address:string;
    apartment:string;
    city:string;
    state:string;
    pinCode:number;
    contact:string;
    region : string;
}

export const initializeAddressForm = (): FormGroup<IAddresseForm> =>
    new FormGroup<IAddresseForm>({
        id: new FormControl<number | null>(0),
        country: new FormControl<string | null>(null, [Validators.required]),
        firstName: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
        lastName: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
        address: new FormControl<string | null>(null, [Validators.required]),
        apartment: new FormControl<string | null>(null, Validators.required),
        city: new FormControl<string | null>(null, Validators.required),
        state: new FormControl<string | null>(null, Validators.required),
        pinCode: new FormControl<number | null>(null, Validators.required),
        contact: new FormControl<string | null>(null, Validators.required),
        region : new FormControl<string | null>(''),
    })


export interface IAddressPayload{
    id:number;
    address:string;
    state:string
    city:string
    pinCode:number;
    email:string;
    contact:string;
    country:string;
    region:string;
    apartment:string;
    firstName:string
    lastName:string
}
