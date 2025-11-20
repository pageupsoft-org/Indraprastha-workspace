import { GenderTypeEnum } from "@shared";

export interface ICollectionResponse{
    total:number;
    collections: ICollection[]
}

export interface ICollection {
    id: number;
    name: string;
    gender: GenderTypeEnum;
    description:string;
}