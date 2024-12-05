import { registerAs } from '@nestjs/config';

export default registerAs('general', () => ({
    environment: process.env.ENVIRONMENT,
    defaultPassword: process.env.DEFAULT_PASSWORD,
    defaultSaltValue: process.env.DEFAULT_SALT_VALUE,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
}));
