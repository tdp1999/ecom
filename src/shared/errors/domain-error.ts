export class DomainError extends Error {
    constructor(payload: { errorCode: string | null; error: string; message: any }) {
        super();
        Object.assign(this, payload);
        Object.setPrototypeOf(this, DomainError.prototype);
    }
}
