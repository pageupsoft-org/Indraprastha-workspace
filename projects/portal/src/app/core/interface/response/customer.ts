export interface customerResponse{
     total : number;
    customers : customers[]
}

export interface customers{
    id : number
    firstName: string
    lastName: string
    isActive : boolean
    email: string
    contact : string
}