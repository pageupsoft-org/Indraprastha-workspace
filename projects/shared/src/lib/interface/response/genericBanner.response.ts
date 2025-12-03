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
    bannerURL: string;
    bannerConnectionType: string;
    bannerType: string;
    gender: string;
    isActive: boolean;
    bannerValueId: number;
}

export interface IBannerPagination extends IPaginationPayload {
    bannerType: EbannerTypes | null;
    bannerConnectionType: EBannerConnectionType | null
    gender: GenderTypeEnum | null;
}


