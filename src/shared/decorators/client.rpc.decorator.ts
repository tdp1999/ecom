import { DomainError } from '@shared/errors/domain-error';

// Use this decorator to wrap the RPC call with error handling
export function RpcClient() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                if (!error || typeof error !== 'object') throw error;

                // Catch error from RPC, since the error go through rpc cannot maintain the class, only object
                // See DomainError.toJson()
                if (error.name === 'DomainError') {
                    throw DomainError.fromJSON(error);
                }

                // If it's a standard Error, you might want to wrap it
                if (error instanceof Error) {
                    throw DomainError.fromJSON({
                        statusCode: 500,
                        errorCode: 'RPC_ERROR',
                        error: 'RPC Call Failed',
                        message: error.message,
                    });
                }

                // Handle any errors that might occur during the RPC call
                throw error;
            }
        };

        return descriptor;
    };
}
