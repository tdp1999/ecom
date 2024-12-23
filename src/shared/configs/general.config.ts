import { registerAs } from '@nestjs/config';

export default registerAs('general', () => ({
    environment: process.env.ENVIRONMENT,
    defaultPassword: process.env.DEFAULT_PASSWORD,
    defaultSaltValue: process.env.DEFAULT_SALT_VALUE,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
    seedingEnabled: process.env.SEEDING_ENABLED,
    defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL,
    defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD,

    transportHost: process.env.TRANSPORT_HOST,
    transportPort: process.env.TRANSPORT_PORT,
}));
