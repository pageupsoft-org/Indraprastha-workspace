export const initializeIResponseDynamicCatalogue = () => {
  return {
    total: 0,
    filter: {
      category: [],
      color: [],
      size: [],
      minPrice: 0,
      maxPrice: 0,
    },
    products: [],
  };
};

export interface IResponseDynamicCatalogue {
  total: number;
  filter: Filter;
  products: Product[];
}

export interface Filter {
  category: Category[];
  color: Color[];
  size: Size[];
  minPrice: number;
  maxPrice: number;
}

export interface Category {
  id: number;
  name: string;
  count: number;

  // used in frontend
  isSelected: boolean;
}

export interface Color {
  id: number;
  name: string;
  count: number;

  // used in frontend
  isSelected: boolean;
}

export interface Size {
  id: number;
  name: string;
  count: number;
}

export interface Product {
  id: number;
  name: string;
  color: string[];
  sizes: string[];
  mrp: number;
  gender: string;
  isWishList: boolean;
  productURL: string[];
}
