import { HTTP_ERROR_STATUS } from './http-error-status';

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

    // Add a method to convert the error to a plain object for serialization
    toJSON() {
        return {
            name: 'DomainError',
            statusCode: this.statusCode,
            errorCode: this.errorCode,
            error: this.error,
            message: this.message,
        };
    }

    // Static method to reconstruct the error from a plain object
    static fromJSON(json: any): DomainError {
        if (json.name !== 'DomainError') {
            throw new Error('Invalid error type');
        }

        return new DomainError({
            statusCode: json.statusCode,
            errorCode: json.errorCode,
            error: json.error,
            message: json.message,
        });
    }
}

export const BadRequestError = (message: any = 'Data is invalid') => {
    return new DomainError({
        statusCode: HTTP_ERROR_STATUS.BAD_REQUEST,
        error: 'Bad Request',
        message: message,
    });
};

export const NotFoundError = (message: any = 'Not Found') => {
    return new DomainError({
        statusCode: HTTP_ERROR_STATUS.NOT_FOUND,
        error: 'Not Found',
        message: message,
    });
};

export const NotSupportedMethodError = (message: any = 'Not Supported Method') => {
    return new DomainError({
        statusCode: HTTP_ERROR_STATUS.INTERNAL_SERVER_ERROR,
        error: 'Not Supported Method',
        message: message,
    });
};
