export interface SigninResponse {
    id: number;
    fullname: string;
    username: string;
    token: string;
    roles: string[];
};