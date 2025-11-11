import { EGender } from "../../enum/gender.enum";

export interface ICollectionResponse{
    total:number;
    collections: ICollection[]
}

export interface ICollection {
    id: number;
    name: string;
    gender: EGender;
    description:string;
}