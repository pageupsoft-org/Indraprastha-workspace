import { EDescriptionType } from '../../enum/discriptionType.enum';

export interface IRProductDetailRoot {
  id: number;
  name: string;
  categoryIds: number[];
  collectionId: number;
  isCustomSize: boolean;
  customSizeName: string;
  collectionName: string;
  mrp: number;
  gender: string;
  _productURL: string[];
  isActive: boolean;
  isWishList: boolean;
  categories: Category[];
  variants: Variant[];
  colorVariants: ColorVariant[];
  // stocks: Stock2[];
  descriptions: Description[];
  relatedProducts: RelatedProduct[];

  _activeImage: string;
}
export function initializeIRProductDetailRoot(): IRProductDetailRoot {
  return {
    id: 0,
    name: '',
    categoryIds: [],
    collectionId: 0,
    isCustomSize: false,
    customSizeName: '',
    collectionName: '',
    mrp: 0,
    gender: '',
    _productURL: [],
    isActive: false,
    isWishList: false,
    categories: [],
    variants: [],
    colorVariants: [],
    // stocks: [],
    descriptions: [],
    relatedProducts: [],
    _activeImage: ''
  };
}

export interface Category {
  id: number;
  name: string;
}
export interface ColorVariant {
  id: number;
  productId: number;
  colorName: string;
  colorVariantURL: string[];
  isActive: boolean;
  stocks: Stock[];
}
export interface RelatedProduct {
  id: number;
  productURL: string;
  productName: string;
  mrp: number;
  isWishList: boolean;
}
export interface categories {
  id: number;
  name: string;
}

export interface Variant {
  id: number;
  productId: number;
  name: string;
  description: string;
  mrp: number;
  variantURL: string;
  // stocks: Stock;
  isCustom: boolean;
}

export interface Stock {
  colorVariantId: number;
  id: number;
  productId: number;
  // variantId: number;
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
  descriptionType: EDescriptionType;
  description: string;
  shortDescription: string;
  jsonText: {key: string; value: string}[];
  _isAccordionOpen: boolean;
}
