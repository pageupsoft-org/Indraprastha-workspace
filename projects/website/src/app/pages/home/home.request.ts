import { IPaginationPayload } from "@shared";
import { EbannerTypes } from "../../../../../portal/src/app/core/enum/banner-types.enum";
import { EBannerConnectionType } from "../../../../../portal/src/app/core/enum/banner-connection-type.enum";
import { EGender } from "../../../../../portal/src/app/core/enum/gender.enum";


export interface IBannerRequest extends IPaginationPayload {
    bannerType:EbannerTypes | null;
    bannerConnectionType:EBannerConnectionType | null;
    gender:EGender | null;
}