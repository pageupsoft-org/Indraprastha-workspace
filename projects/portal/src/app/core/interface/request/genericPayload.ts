export interface IPaginationPayload {
    search: string;
    pageIndex: number;
    top: number;
    showDeactivated: boolean;
    isPaginate: boolean;
    ordersBy: IOrdersBy[]
}

export interface IOrdersBy {
    fieldName: string;
    sort: "Asc" | "Desc";
}

export function initializePagInationPayload(): IPaginationPayload {
    // const orderBy: IOrdersBy = {
    //     fieldName: "Id",
    //     sort: 
    // };
    let payload: IPaginationPayload = {
        search: "",
        pageIndex: 1,
        top: 50,
        showDeactivated: false,
        isPaginate: true,
        ordersBy: []
    }

    return payload;
}