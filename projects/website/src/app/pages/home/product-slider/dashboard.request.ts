import { DashboardProductTypeStringEnum, IPaginationPayload } from "@shared";

export interface IDashboadRequest extends IPaginationPayload {
    type: DashboardProductTypeStringEnum
}