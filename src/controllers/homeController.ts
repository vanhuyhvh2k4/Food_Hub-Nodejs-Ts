import db from "../config/db.config";

class homeController {

    //[GET] baseURL/home/user
    getUser(req: any, res: any) {
        try {
            const userId: number = req.user.id;
            db.query('SELECT id, fullName, avatar, email, phone, address from user WHERE id = ?', [userId], (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'home/getUser.success',
                        message: 'Success',
                        data: {
                            currentUser: result[0]
                        }
                    })
                } else {
                    res.status(404).json({
                        code: 'home/getUser.notFound',
                        message: 'User is not exists'
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'home/getUser.error',

                error: error.message
            })
        }
    }

    //[GET] baseURL/home/shop
    getShop(req: any, res: any) {
        try {
            const userId: number = req.user.id;
            const foodType: string = req.query.foodType;

            db.query('SELECT shop.id, shop.name, shop.image, shop.isTick, shop.shipFee, shop.timeShipping, IF(shop_like.id IS NULL, 0, 1) as liked FROM shop INNER JOIN food_item ON shop.id = food_item.shopId INNER JOIN food_category ON food_item.foodCategoryId = food_category.id LEFT JOIN shop_like ON shop.id = shop_like.shopId AND shop_like.userId = ? WHERE food_category.name = ? GROUP BY shop.name', ([userId, foodType]), (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'home/getShop.success',
                        message: 'Success',
                        data: {
                            shopList: result
                        }
                    });
                } else {
                    res.status(404).json({
                        code: 'home/getShop.notFound',
                        message: 'Dont found the shop',
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'home/getUser.error',

                error: error.message
            })
        }
    }

    //[GET] baseURL/home/food
    getFood(req: any, res: any) {
        try {
            const userId: number = req.user.id;
            const foodType: string = req.query.foodType;

            db.query('SELECT shop.name AS shopName, food_item.id, food_item.name, food_item.image, food_item.description, food_item.price, shop.place, IF (food_like.id IS null, 0, 1) as liked, COUNT(food_order.id) AS numOrders FROM food_item JOIN food_category ON food_item.foodCategoryId = food_category.id JOIN shop ON food_item.shopId = shop.id LEFT JOIN food_like ON food_like.foodId = food_item.id AND food_like.userId = ? LEFT JOIN food_order ON food_order.foodId = food_item.id AND food_order.status = "finished" WHERE food_category.name = ? GROUP BY food_item.id ORDER BY numOrders DESC', ([userId, foodType]), (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'home/getFood.success',
                        message: 'Success',
                        data: {
                            foodList: result
                        }
                    });
                } else {
                    res.status(404).json({
                        code: 'home/getFood.notFound',
                        message: 'Dont found the food',
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'home/getUser.error',

                error: error.message
            })
        }
    }
}

export default new homeController;