import db from "../config/db.config";

export default function checkStatusOfOrder (req: any, res: any, next: any) {
    try {
        const orderId: number = req.params.orderId;

        db.query('SELECT status FROM food_order WHERE id =?', [orderId], (err: any, result: any) => {
            if (err) throw err;
            if (result[0].status === 'waiting confirm') {
                next();
            } else {
                res.status(403).json({
                    code: 'checkStatusOfOrder.forbidden',
                    message: 'You are not allowed to cancel'
                })
            }
        })
    } catch (error: any) {
        res.status(500).json({
            code: 'checkStatusOfOrder.error',
            error: error.message
        })
    }
}