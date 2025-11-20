import { FormControl } from "@angular/forms";
import { IPaginationPayload } from "./genericPayload";
import { EbannerTypes } from "../../../../../../shared/src/lib/enum/banner-types.enum";
import { EBannerConnectionType } from "../../../../../../shared/src/lib/enum/banner-connection-type.enum";
import { GenderTypeEnum } from "@shared";


export interface IBannerForm{
    id: FormControl<number | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    bannerConnectionType: FormControl<string | null>
    bannerType: FormControl<string | null>
    gender : FormControl<string | null>;
    bannerValueId : FormControl<number | null>;
    bannerBase64 : FormControl<string | null>;
}

// export interface IBanner{
//     id:number;
//     name:string;
//     description:string;
//     bannerConnectionType:string;
//     bannerType :string;
//     gender:string;
//     bannerValueId:number;
//     bannerBase64:string;
// }

// export interface IBannerPagination extends IPaginationPayload{
//     bannerType:EbannerTypes | null;
//     bannerConnectionType:EBannerConnectionType | null
//     gender:GenderTypeEnum | null;
// }





