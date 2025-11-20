import { IBanner } from "@shared";

export interface _IBanner extends IBanner{
  bannerValueId:number;
}

export interface IGenericComboResponse{
    id:number;
    name:string;
}