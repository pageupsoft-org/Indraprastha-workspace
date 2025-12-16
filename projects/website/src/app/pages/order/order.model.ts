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
  totalAmount: number;
}

export interface IUpdateOrderStatus {
  orderId: number;
  orderStatus: string;
}
