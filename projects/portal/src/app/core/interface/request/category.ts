import { FormControl } from "@angular/forms";

export interface ICategoryForm{
    id:FormControl<number|null>
    name : FormControl<string | null>
    gst: FormControl<number | null>
    description: FormControl<string | null>
    mainCategoryId: FormControl<number | null>
}

export interface ICategory{
    id:number;
    name:string;
    gst:number;
    description:string;
    mainCategoryId:number;
}