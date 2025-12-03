import { FormControl, FormGroup } from "@angular/forms";
import { EOrderStatus, EStockSize, GenderTypeEnum, IPaginationPayload } from "@shared";

export interface IOrderPagination extends IPaginationPayload {
    startDate: string | null;
    endDate: string | null;
    customerId: number | null;
    status: string | null;
}

export interface IUpdateStatusRequest {
    id: number;
    orderStatus: string;
}

export interface IChangeStatusForm {
    id: FormControl<number | null>;
    orderStatus: FormControl<string | null>
}

export const initializeIChangeStatusForm = (): FormGroup<IChangeStatusForm> =>
    new FormGroup<IChangeStatusForm>({
        id: new FormControl<number | null>(0),
        orderStatus: new FormControl<string | null>('InProcess')
    })


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



