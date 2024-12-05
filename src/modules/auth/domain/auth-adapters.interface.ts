export interface IJwtPayload {
    iss: string;
    sub: string;
    email: string;
    // iat: bigint;
    // exp: bigint;
}

export interface IJwtService {
    generatePayload(iss: string, sub: string, email: string): IJwtPayload;

    sign(payload: IJwtPayload): Promise<string>;

    verify(token: string): Promise<IJwtPayload>;
}
