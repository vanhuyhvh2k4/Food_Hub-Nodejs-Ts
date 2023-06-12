import User from '../Models/User';

const authMiddleware = {
    checkEmail: async (req: any, res: any, next: any) => {
        try {
            const email: string = req.body.email.toLowerCase().trim();

            let user: any = await User.findOne({
                where: {
                    email
                }
            });

            if (user) {
                req.isExist = true;
                req.user = user;
                next();
            } else {
                req.isExist = false;
                next();
            }
        } catch (error) {
            res.status(500).json({
                code: 'auth/checkEmail.error',
                error: error
            })
        }
    },
}

export default authMiddleware;