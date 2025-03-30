export interface SigninResponse {
    id: number;
    fullName: string;
    username: string;
    token: string;
    roles: string[];
    employeeId: number,
    clientId: number,
}
