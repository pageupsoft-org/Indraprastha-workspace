import { FormControl } from "@angular/forms";
import { MStringEnumToArray } from "@shared";

export interface IStockWithIds extends MStringEnumToArray{
    stockId: number;
    productId: number;
    quantity: number;
}

export interface ICartForm{
    stockId: FormControl<number | null>;
    variantStockId: FormControl<number | null>; //id present in Variant -> Stocks -> Id
    quantity: FormControl<number | null>;
}
export interface ICartFormData{
    stockId: number | null;
    variantId: number | null;
    quantity: number | null;
}