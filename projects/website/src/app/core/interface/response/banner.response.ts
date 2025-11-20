import e from "express";
import { EGender } from "../../../../../../portal/src/app/core/enum/gender.enum";

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
    gender:EGender;
    isActive:boolean;
}