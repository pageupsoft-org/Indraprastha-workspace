import { FormControl } from "@angular/forms";
import { IPaginationPayload } from "./genericPayload";
import { EbannerTypes } from "../../enum/banner-types.enum";
import { EBannerConnectionType } from "../../enum/banner-connection-type.enum";
import { EGender } from "../../enum/gender.enum";

export interface IBannerForm{
    id: FormControl<number | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    bannerConnectionType: FormControl<string | null>
    bannerType: FormControl<string | null>
    gender : FormControl<string | null>;
    bannerValueId : FormControl<number | null>;
    bannerBase64 : FormControl<string | null>;
    bType: FormControl<string | null>
}

export interface IBanner{
    id:number;
    name:string;
    description:string;
    bannerConnectionType:string;
    bannerType :string;
    gender:string;
    bannerValueId:number;
    bannerBase64:string;
}

export interface IBannerPagination extends IPaginationPayload{
    bannerType:EbannerTypes | null;
    bannerConnectionType:EBannerConnectionType | null
    gender:EGender | null;
}





