import { FormControl } from "@angular/forms";
// import { EGender } from "../../enum/gender.enum";

export interface IProductForm{
    id:FormControl<number | null>;
    categoryIds:FormControl<number | null>;
    name:FormControl<string | null>;
    isCustomSize:FormControl<boolean | null>;
    customSizeName:FormControl<string | null>;
    color:FormControl<string|null>
    mrp:FormControl<number|null>
    // gender:FormControl<EGender|null>
    
}