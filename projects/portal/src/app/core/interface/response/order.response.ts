
import { EOrderStatus, EStockSize, GenderTypeEnum } from "@shared";


export interface IOrderResponse {
    total: number;
    orders: IOrder[]
}

export interface IOrder {
    id: number;
    orderId: string;
    orderNo: string;
    customerName: string;
    orderDate: Date;
    status: string;
    totalAmount: number;
}

export interface IorderResponseById {
    id: number;
    orderId: string;
    orderNo: string;
    customerName: string;
    orderDate: string;
    status: EOrderStatus;
    totalAmount: number;
    address: IOrderAddress;
    products:IOrderProductDto[]
}

export interface IOrderAddress {
    id: number;
    address: string;
    state: string;
    city: string;
    pinCode: string;
    email: string;
    contact: string;
    country: string;
    region: string;
    apartment: string;
    firstName: string;
    lastName: string;
}

export interface IOrderProductDto {
    productName: string;
    productURL: string;
    variantName: string;
    variantURL: string;
    quantity: number;
    mrp: number;
    total: number;
    gender: GenderTypeEnum;
    size: EStockSize;
}



