import { ICustomer } from "../request/customer";

export interface ICustomerResponse{
     total : number;
     customers : Customers[]
}

export interface Customers extends ICustomer{
    id:number
    isActive:boolean;
}
