export interface IRProductDetailRoot {
  id: number;
  name: string;
  categoryIds: number[];
  isCustomSize: boolean;
  customSizeName: string;
  color: string[];
  mrp: number;
  gender: string;
  productURL: string[];
  activeImage: string; //used in frontedn
  isActive: boolean;
  variants: Variant[];
  stocks: Stock2[];
  descriptions: Description[];
}

export const initializeIRProductDetailRoot = () => {
  return {
    id: 0,
    name: '',
    categoryIds: [],
    isCustomSize: false,
    customSizeName: '',
    color: [],
    mrp: 0,
    gender: '',
    productURL: [],
    activeImage: '', //used in frontedn
    isActive: false,
    variants: [],
    stocks: [],
    descriptions: [],
  };
};

export interface Variant {
  id: number;
  productId: number;
  name: string;
  description: string;
  mrp: number;
  variantURL: string;
  stocks: Stock;
}

export interface Stock {
  id: number;
  productId: number;
  variantId: number;
  quantity: number;
  reservedQuantity: number;
  size: string;
}

export interface Stock2 {
  id: number;
  productId: number;
  variantId: number;
  quantity: number;
  reservedQuantity: number;
  size: string;
}

export interface Description {
  id: number;
  productId: number;
  header: string;
  descriptionType: string;
  description: string;
  jsonText: Array<{key: string; value: string}>;
  shortDescription: string;
}
