import { GenderTypeEnum, IPaginationPayload } from '@shared';
export interface ICategory {
  name: string;
  slug: string;
}

export interface IRequestProductMenu extends IPaginationPayload {
  gender: GenderTypeEnum;
  collectionIds: number[];
  categoryIds: number[];
  colors: string[];
  sizes: number[];
  minPrice: number;
  maxPrice: number;
  newlyAdded: boolean;
}
