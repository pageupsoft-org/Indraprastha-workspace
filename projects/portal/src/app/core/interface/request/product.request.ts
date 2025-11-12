import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { IPaginationPayload } from "./genericPayload";
import { EGender } from "../../enum/gender.enum";
import { EStockSize } from "../../../../../../shared/src/lib/enum/size.enum";
import { EDiscriptionType } from "../../../../../../shared/src/lib/enum/discriptionType.enum";
// import { EGender } from "../../enum/gender.enum";

export interface IProductForm {
    id: FormControl<number | null>;
    categoryIds: FormControl<Array<number>>;
    name: FormControl<string | null>;
    isCustomSize: FormControl<boolean | null>;
    customSizeName: FormControl<string | null>;
    color: FormControl<Array<string>>;
    mrp: FormControl<number | null>
    gender: FormControl<EGender | null>
    stocks: FormArray<FormGroup<stocks>>;
    descriptions: FormArray<FormGroup<description>>;
    productBase64: FormControl<Array<string>>;
    removeURL: FormControl<Array<string>>;
    variants: FormArray<FormGroup<variants>>;
   jsonDescription: FormArray<FormGroup<{ key: FormControl<string | null>; value: FormControl<string | null> }>>;
}

export interface IProductPagination extends IPaginationPayload {
    categoryId: number | null;
    gender: EGender | null;
}

export interface variants {
    id: FormControl<number | null>;
    productId: FormControl<number | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    mrp: FormControl<number | null>;
    stocks: FormGroup<{
        quantity: FormControl<number | null>;
    }>;
    variantBase64: FormControl<string | null>;
}

export interface stocks {
    quantity: FormControl<number | null>
    size: FormControl<EStockSize | null>
}

export interface description {
    header: FormControl<string | null>
    descriptionType: FormControl<EDiscriptionType | null>
    description:  FormControl<string | null>
    shortDescription: FormControl<string | null>
}

// export interface 