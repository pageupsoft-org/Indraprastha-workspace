import { EOrderStatus } from "@shared";
import { IPaginationPayload } from "./genericPayload";

export interface IOrderPagination extends IPaginationPayload {
    startDate: string | null;
    endDate: string | null;
    customerId: number;
    status: EOrderStatus | null;
}
