import db from '../config/db.config';

const authMiddleware = {
    checkEmail: (req: any, res: any, next: any) => {
        try {
            const email: string = req.body.email;

            db.query(`SELECT * FROM user WHERE email='${email}'`, (err: any, users: []) => {
                if (err) throw err;

                if (users.length) {
                    res.status(409).json({
                        code: 'auth/checkEmail.conflict',
                        message: 'Email already exists'
                    })
                } else {
                    next();
                }
            })
        } catch (error) {
            res.status(500).json({
                code: 'auth/checkEmail.error',
                error: error
            })
        }
    },
}

export default authMiddleware;