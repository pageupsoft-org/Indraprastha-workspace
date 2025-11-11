import { EGender } from "../../enum/gender.enum";

export interface ICollectionResponse {
    id: number;
    name: string;
    gender: EGender
}