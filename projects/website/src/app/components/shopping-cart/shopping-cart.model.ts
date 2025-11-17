export interface IRCartRoot {
  name: string;
  color: string[];
  mrp: number;
  gender: string;
  productURL: string[];
  stockId: number;
  size: string;
  stockQuantity: number;
  cartQuantity: number;
  cartId: number;
  productId: number;
  cartVariant: CartVariant;

  _isDisable: boolean;
}

export interface CartVariant {
  name: string;
  mrp: number;
  variantURL: string;
  stockId: number;
  stockQuantity: number;
  cartQuantity: number;
  variantId: number;
}
