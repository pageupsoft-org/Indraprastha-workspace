import { ICategory } from "../request/category.request";

export interface ICategoryResponse {
    total: number;
    categories: ICategory[];
}


