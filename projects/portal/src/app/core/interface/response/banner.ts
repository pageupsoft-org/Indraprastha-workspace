import { IBanner } from "../request/banner";

export interface IBannerResponse{
    total:number
    banners:IBannerResponse[]
}

export interface IBannerResponse extends IBanner{
    bannerURL:string;
    isActive:string
}

export interface IGenericComboResponse{
    id:number;
    name:string;
}