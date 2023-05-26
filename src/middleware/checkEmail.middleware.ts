import db from '../config/db.config';

export const checkEmail = {
    checkHasMail: (req: any, res: any, next: any) => {

        try {
            const clientEmail: string = req.body.email;

            db.query('SELECT * FROM user WHERE email = ?', ([clientEmail]), (err: any, user: any) => {
                if (err) throw err;
                if (user.length) {
                    next();
                } else {
                    res.status(404).json({
                        code: 'middleware/checkhHasEmail.notFound',
                        message: 'Email not found'
                    })
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'middleware/checkhHasMail.error',

                error: error.message
            })
        }
    }
}

export default checkEmail;