export interface IRCartRoot {
  name: string;
  // color: string[];
  color: string;
  mrp: number;
  gender: string;
  productURL: string[];
  stockId: number;
  size: string;
  stockQuantity: number;
  cartQuantity: number;
  cartId: number;
  productId: number;
  cartVariant: CartVariant ;
  // cartVariant: null;
  colorVariantId: number;

  _isDisable: boolean;
}

export interface CartVariant {
  name: string;
  mrp: number;
  // variantURL: string;
  // stockId: number;
  stockQuantity: number;
  cartQuantity: number;
  variantId: number;
}

// initialization
export function defaultCartVariant(): CartVariant {
  return {
    name: '',
    mrp: 0,
    // variantURL: '',
    // stockId: 0,
    stockQuantity: 0,
    cartQuantity: 0,
    variantId: 0,
  };
}

export function defaultIRCartRoot(): IRCartRoot {
  return {
    name: '',
    color: '',
    mrp: 0,
    gender: '',
    productURL: [],
    stockId: 0,
    size: '',
    stockQuantity: 0,
    cartQuantity: 0,
    cartId: 0,
    productId: 0,
    cartVariant: defaultCartVariant(), // Use the helper function for the nested object
    // cartVariant: null,
    _isDisable: false,
    colorVariantId: 0
  };
}
