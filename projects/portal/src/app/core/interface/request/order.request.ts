import { IPaginationPayload } from "@shared";

export interface IOrderPagination extends IPaginationPayload{
    startDate: string | null;
    endDate: string | null;
    customerId:number | null;
    status:string | null;
}