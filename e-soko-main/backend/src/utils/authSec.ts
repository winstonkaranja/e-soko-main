import bcrypt from "bcrypt";

// function to hash and salt a password
export async function hashAndSalt(password: string, saltRounds=10): Promise<string> {
    return await bcrypt.hash(password, saltRounds)
}

// function to compare two passwords
export async function comparePassword(plainPassword: string, hasedAndSaltedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hasedAndSaltedPassword);
}