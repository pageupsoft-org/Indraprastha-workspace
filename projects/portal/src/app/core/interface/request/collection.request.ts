import { FormControl } from "@angular/forms"
import { EGender } from "../../enum/gender.enum"

export interface ICollectionForm{
    id:FormControl<number|null>
    name : FormControl<string | null>
    gender: FormControl<EGender | null>
    description: FormControl<string | null>
}
