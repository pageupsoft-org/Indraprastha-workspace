import { EOrderStatus, IPaginationPayload } from "@shared";

export interface IOrderResponse {
    total: number;
    orders: orders[]
}

export interface orders {
    id: number;
    orderId: string;
    orderNo: string;
    customerName: string;
    orderDate: string;
    status: EOrderStatus;
    totalAmount: number
}

export interface IOrderPagination extends IPaginationPayload {
    startDate: string | null;
    endDate: string | null;
    customerId: number | null;
    status: EOrderStatus;
}