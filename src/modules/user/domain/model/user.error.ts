export const ERR_USER_EMAIL_EXISTS = new Error('User email already exists');
export const ERR_USER_EMAIL_INVALID = new Error('User email is invalid');
export const ERR_USER_PASSWORD_INVALID = new Error(
    'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
);
export const ERR_USER_ALREADY_ACTIVE = new Error('User is already active');
export const ERR_USER_UNABLE_TO_ACTIVATE = new Error('Can only activate users with pending status');
