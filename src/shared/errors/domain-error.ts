import { HTTP_ERROR_STATUS } from './http-error-status';

export class DomainError extends Error {
    statusCode: number;
    errorCode?: string | null;
    error: string;
    message: any;

    /* Factory method - https://refactoring.guru/design-patterns/factory-method */
    private constructor(payload: { statusCode: number; errorCode?: string | null; error: string; message: any }) {
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
        return new DomainError({
            statusCode: json.statusCode,
            errorCode: json.errorCode,
            error: json.error,
            message: json.message,
        });
    }
}

// 400
export const BadRequestError = (message: any = 'Data is invalid', errorCode: string | null = null) => {
    return DomainError.fromJSON({
        statusCode: HTTP_ERROR_STATUS.BAD_REQUEST,
        error: 'Bad Request',
        message: message,
        errorCode,
    });
};

// 401
export const UnauthorizedError = (message: any = 'Unauthorized', errorCode: string | null = null) => {
    return DomainError.fromJSON({
        statusCode: HTTP_ERROR_STATUS.UNAUTHORIZED,
        error: 'Unauthorized',
        message: message,
        errorCode,
    });
};

// 403
export const ForbiddenError = (message: any = 'Forbidden', errorCode: string | null = null) => {
    return DomainError.fromJSON({
        statusCode: HTTP_ERROR_STATUS.FORBIDDEN,
        error: 'Forbidden',
        message: message,
        errorCode,
    });
};

// 404
export const NotFoundError = (message: any = 'Not Found') => {
    return DomainError.fromJSON({
        statusCode: HTTP_ERROR_STATUS.NOT_FOUND,
        error: 'Not Found',
        message: message,
    });
};

// 500
export const InternalServerError = (message: any = 'Internal Server Error') => {
    return DomainError.fromJSON({
        statusCode: HTTP_ERROR_STATUS.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: message,
    });
};

export const NotSupportedMethodError = (message: any = 'Not Supported Method') => {
    return DomainError.fromJSON({
        statusCode: HTTP_ERROR_STATUS.INTERNAL_SERVER_ERROR,
        error: 'Not Supported Method',
        message: message,
    });
};
