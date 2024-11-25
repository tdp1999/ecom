import { compare, hash } from 'bcryptjs';

export async function hashPasswordByBcrypt(password: string, round: number = 10): Promise<string> {
    return await hash(password, round);
}

export async function comparePasswordByBcrypt(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
}
