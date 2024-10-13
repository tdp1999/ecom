import { ZodError } from 'zod';

export function formatZodError(error: ZodError) {
    const flattenedErrors = error.flatten();

    if (flattenedErrors.formErrors && flattenedErrors.formErrors.length > 0) {
        return { formErrors: flattenedErrors.formErrors };
    }

    return {
        ...flattenedErrors.fieldErrors,
    };
}
