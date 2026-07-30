export interface User {
    id: number;
    fullName: string;
    email: string;
    password?: string;
    refreshToken?: string;
    accessToken?: string;
    roles: string[];
    permissions?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}