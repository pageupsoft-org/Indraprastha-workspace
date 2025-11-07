export interface customerResponse {
    total: number;
    employees: employee[];
}

export interface employee {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    contact: string;
    userTypeId:string;
    isActive: boolean;
}