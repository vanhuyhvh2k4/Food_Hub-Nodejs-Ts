import jwt, { verify } from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const accessTokenSecret = process.env.JWT_ACCESSTOKEN_SECRET;
const mailSecret = process.env.JWT_MAIL_SECRET;

const verifyToken = {
    verifyTokenJWT: (req: any, res: any, next: any) => {
        const token = req.headers.token;
        if (token) {
            const accessToken: string = token.split(" ")[1];
            jwt.verify(accessToken, accessTokenSecret!, (err: any, user: any) => {
                if (err) res.status(403).json({
                    code: 'InvalidToken',
                    message: 'Token is invalid'
                });
                else {
                    req.user = user;
                    next();
                }
            })
        } else {
            res.status(401).json({
                code: 'Unauthorized',
                message: 'You are not authenticated'
            });
        }
    },

    verifyTokenMail: (req: any, res: any, next: any) => {
        const token: string = req.query.token;
        const email: string = req.params.email;
        
        if (token && email) {
            jwt.verify(token, mailSecret!, (err: any, user: any) => {
                if (err) {
                    res.status(403).json({
                        code: 'InvalidToken',
                        message: 'Token is invalid'
                    });
                } else {
                    if (user.email === email) {
                        next();
                    } else {
                        res.status(403).json({
                            code: 'Unauthorized',
                            message: 'Email and token do not match'
                        });
                    }
                }
            })
        } else {
            res.status(401).json({
                code: 'Unauthorized',
                message: 'You are not authenticated'
            })
        }
    }
}

export default verifyToken;