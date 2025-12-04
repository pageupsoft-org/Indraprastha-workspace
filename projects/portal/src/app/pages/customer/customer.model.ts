import { FormControl } from "@angular/forms";

export interface ICustomerForm {
    id: FormControl<number | null>
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    contact: FormControl<string | null>;
    userName: FormControl<string | null>;
    password: FormControl<string | null>;
}

export interface ICustomer {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    userName: string | null;
    password: string | null;
}

export interface ICustomerResponse{
     total : number;
     customers : CustomerResponse[]
}

export interface CustomerResponse extends ICustomer{
    id:number
    isActive:boolean;
}
