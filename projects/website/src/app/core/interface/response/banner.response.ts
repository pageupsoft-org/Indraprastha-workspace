import { GenderTypeEnum } from "@shared";


export interface IBannerResponse{
    total:number;
    banners:IBanner[];
}

export interface IBanner{
    id:number;
    name:string;
    description:string;
    bannerURL:string;
    bannerConnectionType:string;
    bannerType:string;
    gender:GenderTypeEnum;
    isActive:boolean;
}