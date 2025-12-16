import { GenderTypeEnum } from "../../enum/gender-type.enum";
import { EOrderStatus } from "../../enum/order-status.enum";
import { EStockSize } from "../../enum/size.enum";

export interface IorderResponseById {
  id: number;
  orderId: string;
  orderNo: string;
  customerName: string;
  orderDate: string;
  status: EOrderStatus;
  totalAmount: number;
  address: IOrderAddress;
  products: IOrderProductDto[];
}
export const initializeOrderResponseById = (): IorderResponseById => ({
  id: 0,
  orderId: '',
  orderNo: '',
  customerName: '',
  orderDate: '',
  status: EOrderStatus.Placed, // or default enum value
  totalAmount: 0,
  address: {} as IOrderAddress,
  products: [],
});
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
