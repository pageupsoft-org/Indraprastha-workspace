export interface IEmployeeResponse {
    total: number;
    employees: IEmployee[];
}

export interface IEmployee {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    contact: string;
    userTypeId:string;
    isActive: boolean;
}

