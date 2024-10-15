import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DomainError } from '../errors/domain-error';

export interface FormattedResponse {
    statusCode: number;
    errorCode: string | null;
    error: string;
    message: any;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();

        if (exception instanceof DomainError) {
            const [status, responseContent] = this._domainExceptionContent(exception);
            httpAdapter.reply(ctx.getResponse(), responseContent, status);
            return;
        }

        if (exception instanceof HttpException) {
            const [status, responseContent] = this._httpExceptionContent(exception);
            httpAdapter.reply(ctx.getResponse(), responseContent, status);
            return;
        }

        const [status, responseContent] = this._unknownExceptionContent(exception, request, this.logger);

        httpAdapter.reply(ctx.getResponse(), responseContent, status);
    }

    private _domainExceptionContent(exception: DomainError): [number, FormattedResponse] {
        const { statusCode, error, message, errorCode = null } = exception;
        return [statusCode, { statusCode, error, message, errorCode }];
    }

    private _httpExceptionContent(exception: HttpException): [number, FormattedResponse] {
        const status = exception.getStatus();
        const errorResponse: Record<string, any> | string = exception.getResponse();

        if (typeof errorResponse === 'string') {
            return [
                status,
                {
                    statusCode: status,
                    error: 'Error',
                    message: errorResponse,
                    errorCode: null,
                },
            ];
        }

        return [
            status,
            {
                statusCode: status,
                error: errorResponse['error'] || 'Error',
                message: errorResponse['message'] || exception.message,
                errorCode: errorResponse['errorCode'] || null,
            },
        ];
    }

    private _unknownExceptionContent(exception: unknown, request: any, logger: Logger): [number, FormattedResponse] {
        const unknownErrorMessage = 'An unknown error occurred. Please try again later.';
        const errorMessage = exception instanceof Error ? exception.message : unknownErrorMessage;
        const stack =
            exception && typeof exception === 'object' && 'stack' in exception
                ? exception['stack']
                : 'No stacktrace available';

        logger.error(`Error occurred for ${request.method} ${request.url}: ${errorMessage}`, stack);

        return [
            HttpStatus.INTERNAL_SERVER_ERROR,
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Internal Server Error',
                message: errorMessage,
                errorCode: null,
            },
        ];
    }
}
