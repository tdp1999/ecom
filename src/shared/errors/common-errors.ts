export const ERR_COMMON_EMPTY_PAYLOAD = new Error('Payload is empty or invalid');
export const ERR_COMMON_INVALID_EMAIL = new Error('Email is invalid');
export const ERR_COMMON_UNAUTHORIZED = new Error('Unauthorized');
export const ERR_COMMON_FORBIDDEN_ACCOUNT = new Error('Your account is forbidden to access this resource');

// Authorize
export const ERR_AUTHORIZE_USER_NOT_FOUND = new Error('User not found during authorization process.');
export const ERR_AUTHORIZE_USER_HAVE_NO_ROLE = new Error('User have no role.');
export const ERR_AUTHORIZE_USER_HAVE_NO_PERMISSION = new Error('User does not have appropriate permission.');
