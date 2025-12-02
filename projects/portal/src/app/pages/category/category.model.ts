import { FormControl } from "@angular/forms";


export interface ICategoryForm{
    id:FormControl<number|null>
    name : FormControl<string | null>
    gst: FormControl<number | null>
    description: FormControl<string | null>
    collectionId: FormControl<number | null>
}

export interface ICategory{
    id:number;
    name:string;
    gst:number;
    description:string;
    collectionName:number;
}



export interface ICategoryResponse {
    total: number;
    categories: ICategory[];
}


