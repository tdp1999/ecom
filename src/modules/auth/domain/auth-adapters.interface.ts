export interface IJwtPayload {
    iss: string;
    sub: string;
    email: string;
}

export interface IJwtData extends IJwtPayload {
    iat: number;
    exp: number;
}

export interface IJwtService {
    generatePayload(iss: string, sub: string, email: string): IJwtPayload;

    sign(payload: IJwtPayload): Promise<string>;

    verify(token: string): Promise<IJwtData>;
}
