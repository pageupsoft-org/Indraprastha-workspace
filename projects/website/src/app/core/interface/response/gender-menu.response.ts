import { GenderTypeEnum } from "@shared";

export interface IResponseGenderMenuRoot {
  gender: GenderTypeEnum;
  collections: Collection[];
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
