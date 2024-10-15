import { DomainError } from './domain-error';
import { HTTP_ERROR_STATUS } from './http-error-status';

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
