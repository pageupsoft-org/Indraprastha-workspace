export interface SortByModel{
    key: string; //same key matching with object key
    sort: "Asc" |"Desc";
    value: string;
}

export const sortByArray: SortByModel[] = [
    {key: 'name', sort: "Asc", value: 'ALPHABETICALLY, A-Z'},
    {key: 'name', sort: "Desc", value: 'ALPHABETICALLY, Z-A'},
    {key: 'mrp', sort: "Asc", value: 'PRICE, LOW TO HIGH'},
    {key: 'mrp', sort: "Desc", value: 'PRICE, HIGH TO LOW'},
    {key: 'id', sort: "Asc", value: 'DATE, OLD TO NEW'},
    {key: 'id', sort: "Desc", value: 'DATE, NEW TO OLD'},
];