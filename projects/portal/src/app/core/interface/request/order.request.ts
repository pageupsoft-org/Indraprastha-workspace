import { FormControl, FormGroup } from "@angular/forms";
import { IPaginationPayload } from "@shared";

export interface IOrderPagination extends IPaginationPayload {
    startDate: string | null;
    endDate: string | null;
    customerId: number | null;
    status: string | null;
}

export interface IUpdateStatusRequest {
    id: number;
    orderStatus: string;
}

export interface IChangeStatusForm {
    id: FormControl<number | null>;
    orderStatus: FormControl<string | null>
}

export const initializeIChangeStatusForm = (): FormGroup<IChangeStatusForm> =>
    new FormGroup<IChangeStatusForm>({
        id: new FormControl<number | null>(0),
        orderStatus: new FormControl<string | null>('InProcess')
    })