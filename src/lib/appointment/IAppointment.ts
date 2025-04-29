import { EmployeeData } from "../employee/IEmployee";
import { PetData } from "../pets/IPet";
import { BaseQueryParams } from "../types";

export interface AppointmentData {
    id?: number;
    petId: PetData;
    designatedDate: string;
    designatedTime: string;
    serviceId: number;
    employeeId: EmployeeData;
}

export interface AppointmentQueryParams extends BaseQueryParams {
    clientRuc?: string;
    employeeRuc?: string;
    petId?: number;
    serviceId?: number;
    formDesignatedDate?: string;
    toDesignatedDate?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' ;

}