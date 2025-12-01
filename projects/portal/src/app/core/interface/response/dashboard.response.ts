import { EOrderStatus } from "@shared";

export interface IDashboardResponse {
  totalPendings: TotalPendings;
  yearlyOrders: YearlyOrder[];
  allOrderCounts: AllOrderCount[];
}

export interface TotalPendings {
  totalOrder: number;
  order: number;
  newCustomer: number;
}

export interface YearlyOrder {
  orderStatus: EOrderStatus;
  orderCount: OrderCount[];
}

export interface OrderCount {
  month: number;
  count: number;
}

export interface AllOrderCount {
  orderStatus: EOrderStatus;
  count: number;
}
