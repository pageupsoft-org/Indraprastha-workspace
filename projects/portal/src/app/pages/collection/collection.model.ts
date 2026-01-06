import { FormControl } from "@angular/forms"
import { GenderTypeEnum } from "@shared"
import { ICategory } from "../category/category.model"


export interface ICollectionForm{
    id:FormControl<number|null>
    name : FormControl<string | null>
    gender: FormControl<GenderTypeEnum | null>
    description: FormControl<string | null>
}

export interface ICollectionResponse{
    total:number;
    collections: ICollection[]
}

export interface ICollection {
    id: number;
    name: string;
    gender: GenderTypeEnum;
    categories: ICategory[];
    description:string;
}


