import { hash } from 'bcryptjs';

export async function hashPasswordByBcrypt(password: string, round: number = 10): Promise<string> {
    return await hash(password, round);
}
