import { ICustomer } from "../request/customer.request";

export interface ICustomerResponse{
     total : number;
     customers : CustomerResponse[]
}

export interface CustomerResponse extends ICustomer{
    id:number
    isActive:boolean;
}
