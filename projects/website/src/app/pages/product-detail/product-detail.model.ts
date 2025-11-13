import { FormControl } from "@angular/forms";
import { MStringEnumToArray } from "@shared";

export interface IStockWithIds extends MStringEnumToArray{
    stockId: number;
    productId: number;
    quantity: number;
}

export interface ICartForm{
    stockId: FormControl<number | null>;
    variantId: FormControl<number | null>;
    quantity: FormControl<number | null>;
}