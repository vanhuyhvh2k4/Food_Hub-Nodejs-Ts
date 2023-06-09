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
    async getShop(req: any, res: any) {
        try {
            
            const userId: number = req.user.id;
            let response:any;
            const type: string = req.query.type || null;
            interface options {
                foodType: string,
                place: string,
                rating: number,
                shipFee: number
            }
            
            const options = {
                foodType: req.query.foodType || null,
                place: req.query.place || null,
                rating: req.query.rating || null,
            }
            const queryGetAll = `SELECT COUNT(review.id) AS num_reviews, ROUND(AVG(review.rating), 1) AS avgRating, food_category.name AS foodType, shop.id, shop.name, shop.image, shop.place, shop.isTick, shop.shipFee, IF(shop_like.id IS NULL, 0, 1) as liked FROM shop  JOIN food_item ON shop.id = food_item.shopId LEFT JOIN food_order ON food_item.id = food_order.foodId JOIN food_category ON food_category.id = food_item.foodCategoryId LEFT JOIN review ON food_order.id = review.orderId  LEFT JOIN shop_like ON shop_like.shopId = shop.id AND shop_like.userId = ? GROUP BY shop.id ORDER BY num_reviews DESC, avgRating DESC ${type !== 'all' ? `LIMIT 5` : ``}`;
            
            let result: any = await db.promise().query(queryGetAll, ([userId]));

            //pagination varriables
            const pageIndex: number = req.query.page || null;
            let itemPerPage: number = 4;
            let start = itemPerPage * (pageIndex - 1);
            let end = start + itemPerPage;

            if (type === 'all' && pageIndex > 0) {
                    if (options.foodType || options.place || options.rating) {
                        const filteredData = result[0].filter((item: any) => {
                            return Object.entries(options)
                              .filter(([key, value]) => value !== null)
                              .reduce((acc, [key, value]) => {
                                return acc && item[key] === value;
                              }, true);
                          });

                          response = filteredData.slice(start, end);
                    } else {
                        response = result[0].slice(start, end);
                    }
            } else {
                response = result[0];
            }

            if (response.length) {
                res.status(200).json({
                    code: 'home/getShop.success',
                    message: 'Success',
                    data: {
                        shopList: response
                    }
                })
            } else {
                res.status(404).json({
                    code: 'home/getShop.notFound',
                    message: 'Not Found'
                })
            }
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
            const foodType: string = req.query.foodType.toLowerCase().trim();

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