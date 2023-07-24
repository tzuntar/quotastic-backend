export interface TokenPayload {
    sub: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    type: JwtType;
}

export enum JwtType {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN'
}
