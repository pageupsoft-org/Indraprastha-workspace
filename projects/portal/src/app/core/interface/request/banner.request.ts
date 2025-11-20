import { FormControl } from "@angular/forms";
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





