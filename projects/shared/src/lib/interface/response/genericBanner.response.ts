import { EBannerConnectionType } from "../../enum/banner-connection-type.enum";
import { EbannerTypes } from "../../enum/banner-types.enum";
import { GenderTypeEnum } from "../../enum/gender-type.enum";
import { IPaginationPayload } from "../request/pagination.request";

export interface IBannerResponse {
    total: number
    banners: IBanner[]
}

export interface IBanner {
    id: number;
    name: string;
    description: string;
    bannerConnectionType: string;
    bannerType: string;
    gender: string;
    bannerBase64: string;
    isActive: string;
    bannerURL:string;
}

export interface IBannerAddBannerValueId{
    bannerValueId:number;
}

export interface IBannerPagination extends IPaginationPayload {
    bannerType: EbannerTypes | null;
    bannerConnectionType: EBannerConnectionType | null
    gender: GenderTypeEnum | null;
}


