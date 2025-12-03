import { FormControl } from "@angular/forms";

export interface IEmployeeForm {
    id: FormControl<number | null>
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    contact: FormControl<string | null>;
    userType: FormControl<string | null>;
    address: FormControl<string | null>;
    username: FormControl<string | null>;
    password: FormControl<string | null>;
    isLogin : FormControl<boolean | null>
}

export interface IEmployee {
    id:number| 0;
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    userType: string;
    address: string;
    username: string | null;
    password: string | null;
    isLogin: boolean | null
}

export interface IEmployeeResponse {
    total: number;
    employees: IEmployee[];
}

export interface IEmployee {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    contact: string;
    userTypeId:string;
    isActive: boolean;
}











