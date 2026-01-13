import { FormControl } from '@angular/forms';
import { MStringEnumToArray } from '@shared';

export interface IStockWithIds extends MStringEnumToArray {
  stockId: number;
  productId: number;
  quantity: number;
  colorVariantId: number;
}

export interface ICartForm {
  stockId: FormControl<number | null>; //color variant stock id, present in colorVariant-> Stocks -> id
  quantity: FormControl<number | null>;
  // variantStockId: FormControl<number | null>; //id present in Variant -> Stocks -> Id
  _colorVarintId: FormControl<number | null>;
  tailorId: FormControl<number | null>;
  variantId: FormControl<number | null>;
  // colorVariantStockId: FormControl<number | null>;
}
export interface ICartFormData {
  stockId: number | null;
  // variantId: number | null;
  quantity: number | null;
}

export interface IProductInfoPayload {
  id: number;
  isRelatedItem: boolean;
}

export interface IQueryToCheckout {
  id: number;
  name: string;
  color: string;
  colorId: number;
  price: number;
  qty: number;
  stockQty: number;
  
  size: string;
  stockId: number;

  variantId: number;
  variantName: string;
}

export const initializeIQueryToCheckout = ():IQueryToCheckout => {
  return {
    id: 0,
    colorId: 0,
    name: '',
    color: '',
    price: 0,
    size: '',
    qty: 0,
    stockQty: 0,

    stockId: 0,
    variantId: 0,
    variantName: ''
  };
};
