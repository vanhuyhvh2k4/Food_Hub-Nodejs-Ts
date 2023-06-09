import bcrypt from 'bcrypt';

const saltRounds: number = 10;

export let hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

export let checkPassword = (password: string, hashed: string) => {
    return bcrypt.compareSync(password, hashed);
};