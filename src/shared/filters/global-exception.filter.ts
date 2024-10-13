import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export interface FormattedResponse {
    statusCode: number;
    errorCode: string | null;
    error: string;
    message: any;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const [status, responseContent] = this._defineErrorContent(exception);

        response.status(status).json(responseContent);
    }

    private _defineErrorContent(exception: unknown): [number, FormattedResponse] {
        if (exception instanceof HttpException) {
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

        const unknownErrorMessage = 'An unknown error occurred. Please try again later.';
        const errorMessage = exception instanceof Error ? exception.message : unknownErrorMessage;

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
