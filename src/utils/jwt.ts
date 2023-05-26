import dotenv from 'dotenv';
dotenv.config();
const secretAccessToken = process.env.JWT_ACCESSTOKEN_SECRET;
const secretRefreshToken = process.env.JWT_REFRESHTOKEN_SECRET;
const secretMailToken = process.env.JWT_MAIL_SECRET;
import jwt from "jsonwebtoken";

interface User {
    id: number,
        email: string,
}

const JWTUntils = {
    generateAccessToken: (user: User) => {
        const payload: object = {
            id: user.id,
            email: user.email
        }
        const token: string = jwt.sign(payload, secretAccessToken!, {
            expiresIn: '30s'
        })
        return token;
    },
    generateRefreshToken: (user: User) => {
        const payload: object = {
            id: user.id,
            email: user.email
        }
        const token: string = jwt.sign(payload, secretRefreshToken!, {
            expiresIn: '365d'
        })
        return token;
    },
    generateEmailToken: (email: string) => {
        const token: string = jwt.sign({
            email
        }, secretMailToken!, {
            expiresIn: '120s'
        })
        return token;
    }
}

export default JWTUntils;