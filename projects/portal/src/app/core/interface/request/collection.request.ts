import { FormControl } from "@angular/forms"
import { GenderTypeEnum } from "@shared"


export interface ICollectionForm{
    id:FormControl<number|null>
    name : FormControl<string | null>
    gender: FormControl<GenderTypeEnum | null>
    description: FormControl<string | null>
}
