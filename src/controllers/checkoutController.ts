import db from "../config/db.config";

class CheckoutController {

    //[POST] baseUrl/checkout/cart
    addCart(req: any, res: any) {
        try {
            const userId: number = req.user.id;
            const foodId: number = req.body.foodId;
            const quantity: number = req.body.quantity;

            db.query('INSERT INTO cart(userId, foodId, quantity) VALUES (?, ?, ?)', ([userId, foodId, quantity]), (err: any, result: any) => {
                if (err) throw err;

                if (result) {
                    res.status(200).json({
                        code: 'checkout/addCart.success',
                        message: 'added to cart'
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'checkout/addCart.error',

                error: error.message
            })
        }
    }

    //[GET] baseUrl/checkout/number
    getNumber(req: any, res: any) {
        try {
            const userId: number = req.user.id;

            db.query('SELECT COUNT(cart.id) AS num FROM cart WHERE cart.userId = ?', [userId], (err: any, result: any) => {
                if (err) throw err;
                if (result) {
                    res.status(200).json({
                        data: {
                            code: 'checkout/getNumber.success',
                            message: 'successful',
                            num: result[0].num
                        }
                    });
                } else {
                    res.status(404).json({
                        code: 'checkout/getNumber.notFound',
                        message: 'not found userId'
                    })
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'checkout/getNumber.error',

                error: error.message
            });
        }
    }

    //[GET] baseUrl/checkout/cart
    getCart(req: any, res: any) {
        try {
            const userId: number = req.user.id;

            db.query('SELECT cart.id, food_item.name, food_item.image, food_item.price, cart.quantity, shop.name AS shopName FROM cart JOIN user ON user.id = cart.userId JOIN food_item ON food_item.id = cart.foodId JOIN shop ON food_item.shopId = shop.id WHERE user.id = ?', [userId], (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        data: {
                            code: 'checkout/getCart.success',
                            message: 'successful',
                            listCart: result
                        }
                    })
                } else {
                    res.status(404).json({
                        data: {
                            code: 'checkout/getCart.notFound',
                            message: 'not found userId'
                        }
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'checkout/getCart.error',

                error: error.message
            })
        }
    }

    //[DELETE] baseUrl/checkout/cart/:cartId
    deleteCart(req: any, res: any) {
        try {
            const userId: number = req.user.id;
            const cartId: number = req.params.cartId;

            db.query('DELETE FROM cart WHERE id = ? AND userId = ?', ([cartId, userId]), (err: any, result: any) => {
                if (err) throw err;
                if (result) {
                    res.status(200).json({
                        data: {
                            code: 'checkout/deleteCart.success',
                            message: 'successful',
                        }
                    });
                } else {
                    res.status(404).json({
                        code: 'checkout/deleteCart.notFound',
                        message: 'not found userId or cartId'
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'checkout/deleteCart.error',

                error: error.message
            });
        }
    }

    //[GET] baseUrl/checkout/bill
    getBill(req: any, res: any) {
        try {
            const cartId: number = req.query.cartId;
            db.query('SELECT cart.id, food_item.id AS foodId, food_item.name, food_item.image, food_item.price, cart.quantity, shop.shipFee FROM cart JOIN food_item ON food_item.id = cart.foodId JOIN shop ON shop.id = food_item.shopId WHERE cart.id = ?', [cartId], (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {
                    const totalOfFood = result[0].price * result[0].quantity;
                    const total = (result[0].price * result[0].quantity) + result[0].shipFee;

                    res.status(200).json({
                        data: {
                            code: 'checkout/getBill.success',
                            message: 'successful',
                            bill: {
                                ...result[0],
                                totalOfFood,
                                total
                            }
                        }
                    });
                } else {
                    res.status(404).json({
                        data: {
                            code: 'checkout/getBill.notFound',
                            message: 'not found cartId',
                        }
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'checkout/getBill.error',

                error: error.message
            });
        }
    }

    //[POST] baseUrl/checkout/order
    async order(req: any, res: any) {
        try {
            const cartId: number = req.body.cartId;
            const userId: number = req.user.id;
            const foodId: number = req.body.foodId;
            const quantity: number = req.body.quantity;

            await db.promise().query('DELETE FROM cart WHERE id = ? AND userId = ?', ([cartId, userId]));

            db.query('INSERT INTO food_order(userId, foodId, quantity, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP())', ([userId, foodId, quantity]), (err: any, result: any) => {
                if (err) throw err;
                if (result) {
                    res.status(200).json({
                        data: {
                            code: 'checkout/order.success',
                            message: 'order successfully'
                        }
                    })
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'checkout/order.error',

                error: error.message
            })
        }
    }

    //[GET] baseUrl/checkout/order
    myOrder(req: any, res: any) {
        try {
            const userId: number = req.user.id;
            const option: string = req.query.option;
            let filter: string;

            switch (option) {
                case "waiting confirm":
                    filter = `("waiting confirm")`;
                    break;
                case "preparing":
                    filter = `("preparing")`;
                    break;
                case "on the way":
                    filter = `("on the way")`;
                    break;
                default:
                    filter = `("waiting confirm", "preparing", "on the way")`;
                    break;
            }

            db.query(`SELECT food_order.id, food_item.name, food_item.image, shop.name AS shopName, shop.isTick, food_order.status, food_order.quantity, ((food_order.quantity * food_item.price) + shop.shipFee) AS price FROM food_order JOIN food_item ON food_item.id = food_order.foodId JOIN shop ON shop.id = food_item.shopId WHERE food_order.userId = ? AND food_order.status IN ${filter} ORDER BY food_order.timestamp DESC`, ([userId]), (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {

                    res.status(200).json({
                        data: {
                            code: 'checkout/myOrder.success',
                            message: 'successfully',
                            list: result
                        }
                    })
                } else {
                    res.status(404).json({
                        code: 'checkout/myOrder.notFound',
                        message: 'not found userId or user is not order'
                    })
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'checkout/myOrder.error',

                error: error.message
            })
        }
    }

    //[DELETE] baseUrl/checkout/order/:orderId
    cancel(req: any, res: any) {
        try {
            const orderId: number = req.params.orderId;

            db.query('UPDATE food_order SET status = "canceled", timestamp = CURRENT_TIMESTAMP() WHERE id = ?', ([orderId]), (err: any, result: any) => {
                if (err) throw err;
                if (result) {
                    res.status(200).json({
                        data: {
                            code: 'checkout/cancel.success',
                            message: 'canceled successfully'
                        }
                    });
                } else {
                    res.status(404).json({
                        data: {
                            code: 'checkout/cancel.notFound',
                            message: 'not found userId or user is not order'
                        }
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'checkout/cancel.error',
                error: error.message
            });
        }
    }

    //[GET] baseUrl/checkout/order/history
    getOrderHistory(req: any, res: any) {
        try {
            const userId: number = req.user.id;
            const option: string = req.query.option;
            let filter:string;

            switch (option) {
                case "finished":
                    filter = `("finished")`;
                    break;
                case "canceled":
                    filter = `("canceled")`;
                    break;
                default:
                    filter = `("finished", "canceled")`;
                    break;
            }

            db.query(`SELECT IF(review.id IS NULL, 0, 1) AS isRated, food_order.id, food_item.name, food_item.image, food_item.price, shop.name AS shopName, shop.shipFee, shop.isTick, food_order.status, food_order.quantity, food_order.timestamp FROM food_order JOIN food_item ON food_item.id = food_order.foodId JOIN shop ON shop.id = food_item.shopId LEFT JOIN review ON review.orderId = food_order.id WHERE food_order.userId = ? AND food_order.status IN ${filter} ORDER BY food_order.timestamp DESC`, [userId], (err: any, results: any) => {
                if (err) throw err;
                if (results.length) {
                    const response = results.map((item: any) => {
                        const id: number = item.id;
                        const name: string = item.name;
                        const image: string = item.image;
                        const shopName: string = item.shopName;
                        const isTick: boolean = item.isTick;
                        const status: string = item.status;
                        const isRated: boolean = item.isRated;
                        const quantity: number = item.quantity;
                        const time = new Date(item.timestamp);
                        const formatTime: string = time.toDateString().replace(',', '')
                        const price: number = (quantity * item.price) + item.shipFee;
                        return {
                            id,
                            name,
                            image,
                            shopName,
                            quantity,
                            isTick,
                            status,
                            isRated,
                            time: formatTime,
                            price
                        }
                    })

                    res.status(200).json({
                        data: {
                            code: 'checkout/getOrderHisotry.success',
                            list: response
                        }
                    });
                } else {
                    res.status(404).json({
                        code: 'checkout/getOrderHistory.notFound',
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'checkout/cancel.error',
                error: error.message
            });
        }
    }

    //[GET] baseUrl/checkout/order/detail/:orderId
    getOrderDetail(req: any, res: any) {
        try {
            const orderId: number = req.params.orderId

            db.query('SELECT food_order.id, food_item.name, food_item.image, food_item.price, food_order.quantity, food_order.status, shop.name AS shopName, shop.place, shop.isTick, shop.shipFee, shop.image AS shopImage FROM food_order JOIN food_item ON food_item.id = food_order.foodId JOIN shop ON shop.id = food_item.shopId WHERE food_order.id = ?', [orderId], (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {
                    const totalOfFood = result[0].price * result[0].quantity;
                    const total = (result[0].price * result[0].quantity) + result[0].shipFee;

                    res.status(200).json({
                        data: {
                            code: 'checkout/getBill.success',
                            message: 'successful',
                            bill: {
                                ...result[0],
                                totalOfFood,
                                total
                            }
                        }
                    });
                } else {
                    res.status(404).json({
                        data: {
                            code: 'checkout/getBill.notFound',
                            message: 'not found cartId',
                        }
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'checkout/getBill.error',

                error: error.message
            });
        }
    }
}

export default new CheckoutController;