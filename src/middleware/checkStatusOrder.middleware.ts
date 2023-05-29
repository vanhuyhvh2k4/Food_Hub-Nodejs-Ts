import db from "../config/db.config";

const checkStatusOfOrder = {
    isBought: (req: any, res: any, next: any) => {
        try {
            const orderId: number = req.params.orderId;

            db.query('SELECT status FROM food_order WHERE id =?', [orderId], (err: any, result: any) => {
                if (err) throw err;
                if (result[0].status === 'waiting confirm') {
                    next();
                } else {
                    res.status(403).json({
                        code: 'checkStatusOfOrder.forbidden',
                        message: 'The order is not confirmed yet'
                    })
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'checkStatusOfOrder.error',
                error: error.message
            })
        }
    },
    isConfirmed: (req: any, res: any, next: any) => {

    },
    isFinished: (req: any, res: any, next: any) => {
        try {
            const orderId: number = req.params.orderId;

            db.query('SELECT status FROM food_order WHERE id =?', [orderId], (err: any, result: any) => {
                if (err) throw err;
                if (result[0].status === 'finished') {
                    next();
                } else {
                    res.status(403).json({
                        code: 'checkStatusOfOrder.forbidden',
                        message: 'The order is not finished yet'
                    });
                }
            })
        } catch (error) {
            
        }
    },
    isCanceled: (req: any, res: any, next: any) => {

    }
}

export default checkStatusOfOrder;