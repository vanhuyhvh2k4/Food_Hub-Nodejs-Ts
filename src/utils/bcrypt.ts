import bcrypt from 'bcrypt';
import "dotenv/config";

const saltRounds: number = parseInt(process.env.SALT_ROUNDS!);

export let hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

export let checkPassword = (password: string, hashed: string) => {
    return bcrypt.compareSync(password, hashed);
};