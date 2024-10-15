export class DomainError extends Error {
    statusCode: number;
    errorCode?: string | null;
    error: string;
    message: any;

    constructor(payload: { statusCode: number; errorCode?: string | null; error: string; message: any }) {
        super();
        Object.assign(this, payload);
        Object.setPrototypeOf(this, DomainError.prototype);
    }
}
