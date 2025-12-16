import { IPaginationPayload } from "../request/pagination.request";


export interface MStringEnumToArray {
  key: string;
  value: string;
}

export interface IOrderPagination extends IPaginationPayload {
  startDate: string | null;
  endDate: string | null;
  customerId: number | null;
  status: string | null;
}

export interface IOrderResponse {
  total: number;
  orders: IOrder[];
}

export interface IOrder {
  id: number;
  orderId: string;
  orderNo: string;
  customerName: string;
  orderDate: Date;
  status: string;
  productURL: string[];
  totalAmount: number;
}
