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
  price: number;
  qty: number;
  
  size: string;
  stockId: number;

  // variantStockId: number;
  // variantName: string;
}

export const initializeIQueryToCheckout = () => {
  return {
    id: 0,
    name: '',
    price: 0,
    size: '',
    qty: 0,

    stockId: 0,
    variantStockId: 0,
    variantName: ''
  };
};
