import { GenderTypeEnum } from '@shared';

export interface IResponseGenderMenuRoot {
  gender: GenderTypeEnum;
  collections: Collection[];
  products: ProductComboUrl[];
}

export interface Collection {
  id: number;
  name: string;
  description: string;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface ProductComboUrl {
  id: number;
  productURL: string;
  isWishList: boolean;
  mrp: number;
}
