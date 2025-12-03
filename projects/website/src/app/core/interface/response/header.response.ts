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
  products: ProductHeader[];
}

export interface Filter {
  category: CategoryFilter[];
  color: Color[];
  size: Size[];
  minPrice: number;
  maxPrice: number;
}

export interface CategoryFilter {
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

export interface ProductHeader {
  id: number;
  name: string;
  color: string[];
  sizes: string[];
  mrp: number;
  gender: string;
  isWishList: boolean;
  productURL: string[];
}
