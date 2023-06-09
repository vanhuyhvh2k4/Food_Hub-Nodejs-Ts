import jwt from 'jsonwebtoken';
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject
} from 'firebase/storage'
import path from 'path'
import 'dotenv/config';

import sendMail from '../utils/mailer';
import JWTUntils from '../utils/jwt';
import {
    checkPassword,
    hashPassword
} from '../utils/bcrypt';
import User from '../Models/User';

class AuthControlller {
    //[POST] baseUrl/auth
    verifyToken(req: any, res: any) {
        res.status(200).json({
            data: {
                code: 'auth/verifyToken.success',
                message: 'token verification successful'
            }
        })
    }

    //[POST] BaseURL/auth/register
    async register(req: any, res: any) {
        try {
            let fullName: string = (req.body.fullName).toLowerCase().trim();
            let email: string = req.body.email.toLowerCase().trim();
            let password: string = req.body.password.trim();
            let isExist = req.isExist;
            //Hash password
            let passwordHashed: string = await hashPassword(password);

            if (isExist) {
                res.status(409).json({
                    code: 'auth/register.conflict',
                    message: 'Email already exists'
                })
            } else {
                //Create a new user in database
                await User.create({
                    fullName: fullName,
                    email: email,
                    password: passwordHashed
                });
    
                res.status(200).json({
                    code: 'auth/register.success',
                    message: 'Your account has been registered'
                })
            }

        } catch (error: any) {
            res.status(500).json({
                code: 'auth/register.error',
                error: error.message
            })
        }
    }

    //[POST] BaseURL/auth/login
    async login(req: any, res: any) {
        try {
            let email: string = req.body.email.toLowerCase().trim();
            let password: string = req.body.password.trim();
            let accessToken: string;
            let refreshToken: string;

            //Get data from database
            let user: any = await User.findOne({
                where: {
                    email,
                }
            });

            if (user) {
                //Check if password is correct
                let isCorrect: boolean = checkPassword(password, user.password);

                if (isCorrect) {
                    //create access token and refresh token
                    accessToken = JWTUntils.generateAccessToken(user)
                    refreshToken = JWTUntils.generateRefreshToken(user)
                    res.status(200).json({
                        code: 'auth/login.success',
                        data: {
                            accessToken,
                            refreshToken
                        }
                    });
                } else {
                    res.status(401).json({
                        code: 'auth/login.unauthorized',
                        message: 'Email or password is incorrect'
                    })
                }
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'auth/login.error',
                error: error.message
            })
        }
    }

    //[POST] BaseURL/auth/token
    refreshToken(req: any, res: any) {
        let refreshToken: string = req.body.refreshToken;
        if (!refreshToken) res.status(401).json('you are not authenticated');
        jwt.verify(refreshToken, process.env.JWT_REFRESHTOKEN_SECRET!, (err: any, user: any) => {
            if (err) res.status(403).json('token is invalid');

            let newAccessToken: string = JWTUntils.generateAccessToken(user);
            let newRefreshToken: string = JWTUntils.generateRefreshToken(user);
            res.status(200).json({
                data: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                }
            })
        })
    }

    //[PATCH] baseUrl/auth/profile/:userId
    async changeAvatar(req: any, res: any) {
        try {
            let storage = getStorage();
            let userId: number = req.user.id;

            let user: any = await User.findOne({
                where: {
                    id: userId
                }
            });
            let oldAvatarUrl: string = user.avatar;
            let hasOldAvatar: boolean = !!oldAvatarUrl;

            if (hasOldAvatar) {
                // Delete old image with same name
                let oldStorageRef = ref(storage, `user_avatar/${userId + path.extname(req.file.originalname)}`);
                await deleteObject(oldStorageRef);
            }

            //upload new image
            let storageRef = ref(storage, `user_avatar/${userId + path.extname(req.file.originalname)}`);
            let snapshot = await uploadBytesResumable(storageRef, req.file.buffer);
            let url: string = await getDownloadURL(snapshot.ref);

            await User.update({
                avatar: url
            }, {
                where: {
                    id: userId
                }
            });

            res.status(200).json({
                code: 'auth/changeAvatar.success',
                message: 'Successfully changed',
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'auth/changeAvatar.error',

                error: error.message
            })
        }
    }

    //[PUT] baseUrl/auth/profile/:userId
    async changeProfile(req: any, res: any) {
        try {
            let userId: number = req.user.id;
            let fullName: string = req.body.fullName.toLowerCase().trim();
            let phone: string = req.body.phone.trim();
            let address: string = req.body.address.toLowerCase().trim();

            await User.update({
                fullName,
                phone,
                address
            }, {
                where: {
                    id: userId
                }
            });

            res.status(200).json({
                code: 'auth/changeProfile.success',
                message: 'Successfully changed',
            });
        } catch (error: any) {
            res.status(500).json({
                code: 'auth/changeProfile.error',

                error: error.message
            })
        }
    }

    //[POST] baseURL/auth/password
    sendMail(req: any, res: any) {
        try {
            let isExist: boolean = req.isExist;
            let email: string = req.body.email.toLowerCase().trim();
            let emailToken: string = JWTUntils.generateEmailToken(email);

            if (isExist) {
                sendMail(email, "Reset password", `
            <div style="width: 100%; background-color: #fff;">
        <header style="background-color: #333; padding: 12px; color: #fff; display: flex; justify-content: end;">
            <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">VIEW IN BROWSER</span>
        </header>
        <main style="display: flex; flex-direction: column; align-items: center; padding: 32px;">
            <div style="display: flex; align-items: center;">
                <img style="width: 50px; height: 50px; flex-shrink: 0; object-fit: cover;"
                    src="https://th.bing.com/th/id/OIP.504ZOEY-quI4tFXyM-X0KgHaHa?pid=ImgDet&rs=1" alt="">
                <h2 style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-left: 6px;">FOOD HUB</h2>
            </div>
            <h1 style="text-align: center; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; text-transform: uppercase;">Easy ordering, fast delivery</h1>
            <p style="text-align: justify; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">Hi,
    
                You are receiving this email because you requested to reset the password for your account on <b>FOOD HUB</b>. Please click the link below to reset your password:
                </p>
            <a href="${process.env.APP_URL}/forgot/reset/${email}?token=${emailToken}" style="background-color: rgb(124, 124, 239); border: none; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">SET PASSWORD</a>
            <p style="text-align: justify; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">
                If you did not request to reset your password, please ignore this email. If you have any issues, please contact us for assistance.
                Best regards, <br>
                <b>FOOD HUB </b>
            </p>
            <hr width="100%" style="margin-top: 24px;">
        </main>
    </div>
            `);
                res.status(200).json({
                    code: 'password/sendMail.success',
                    message: 'we sent your email successfully',
                    from: process.env.USERNAME_MAIL,
                    to: email
                });
            } else {
                res.status(404).json({
                    code: 'auth/sendEmail.notFound',
                    message: 'User not found'
                });
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'password/sendMail.error',
                error: error.message
            })
        }
    }

    //[GET] baseUrl/auth/password/:email
    async reset(req: any, res: any) {
        try {
            let email: string = req.params.email.toLowerCase().trim();
            let newPassword: string = req.body.password.trim();
            let passwordHashed: string = await hashPassword(newPassword);

            User.update({
                password: passwordHashed
            }, {
                where: {
                    email
                }
            });

            res.status(200).json({
                code: 'password/reset.success',
                message: 'changed your password successfully'
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'password/reset.error',

                error: error.message
            });
        }

    }

    //[POST] baseUrl/auth/social
    async socialSignIn(req: any, res: any) {
        try {
            let isExist: boolean = req.isExist;
            let fullName: string = req.body.fullName.toLowerCase().trim();
            let email: string = req.body.email.toLowerCase().trim();
            let avatar: string = req.body.avatar.trim();
            let user = req.user;
            // check if has already signed in return token else create a new account and return token
            if (isExist) {
                res.status(200).json({
                    data: {
                        currentUser: user[0],
                        accessToken: JWTUntils.generateAccessToken(user[0]),
                        refreshToken: JWTUntils.generateRefreshToken(user[0])
                    }
                });
            } else {
                await User.create({
                    fullName,
                    email,
                    avatar,
                    type: 1
                });

                let user: any = await User.findOne({
                    where: {
                        email,
                        type: 1
                    }
                });

                if (user) {
                    res.status(200).json({
                        data: {
                            accessToken: JWTUntils.generateAccessToken(user),
                            refreshToken: JWTUntils.generateRefreshToken(user)
                        }
                    });
                } else {
                    res.status(404).json({
                        code: 'auth/login.notFound',
                        message: 'email is not exist'
                    });
                }
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'auth/login.error',
                error: error.message
            })
        }
    }
}

export default new AuthControlller;