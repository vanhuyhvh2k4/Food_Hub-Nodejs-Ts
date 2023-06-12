import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";
const secretAccessToken = process.env.JWT_ACCESSTOKEN_SECRET!;
const secretRefreshToken = process.env.JWT_REFRESHTOKEN_SECRET!;
const secretMailToken = process.env.JWT_MAIL_SECRET!;

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
            expiresIn: process.env.ACCESS_EXPRICES!
        })
        return token;
    },
    generateRefreshToken: (user: User) => {
        const payload: object = {
            id: user.id,
            email: user.email
        }
        const token: string = jwt.sign(payload, secretRefreshToken!, {
            expiresIn: process.env.REFRESH_EXPRICES!
        })
        return token;
    },
    generateEmailToken: (email: string) => {
        const token: string = jwt.sign({
            email
        }, secretMailToken!, {
            expiresIn: process.env.MAIL_EXPREICES!
        })
        return token;
    }
}

export default JWTUntils;