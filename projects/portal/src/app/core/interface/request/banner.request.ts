import { FormControl } from "@angular/forms";
import { GenderTypeEnum } from "@shared";


export interface IBannerForm {
    id: FormControl<number | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    bannerConnectionType: FormControl<string | null>
    bannerType: FormControl<string | null>
    gender: FormControl<string | null>;
    bannerValueId: FormControl<number | null>;
    bannerBase64: FormControl<string | null>;
}


export interface IBannerFormValue {
    id: number | null;
    name: string | null;
    description: string | null;
    bannerConnectionType: string | null;
    bannerType: string | null;
    gender: string | null;
    bannerValueId: number | null;
    bannerBase64: string | null;
}


