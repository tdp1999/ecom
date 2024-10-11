import { registerAs } from '@nestjs/config';

export default registerAs('general', () => ({
    environment: process.env.ENVIRONMENT,
}));
