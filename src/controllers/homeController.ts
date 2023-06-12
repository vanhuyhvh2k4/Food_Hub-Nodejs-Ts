import User from "../Models/User";
import Shop from "../Models/Shop";
import Food from "../Models/Food";
import Order from "../Models/Order";
import Category from "../Models/Category";
import Review from "../Models/Review";
import sequelize from "../config/sequelize.config";

class homeController {

    //[GET] baseURL/home/user
    async getUser(req: any, res: any) {
        try {
            let userId: number =  req.user.id;
            let user: any = await User.findOne({
                attributes: [
                    'id',
                    'avatar',
                    'fullName',
                    'email',
                    'phone',
                    'address',
                ],
                where: {
                    id: userId
                }
            });

            if (user) {
                res.status(200).json({
                    code: 'home/getUser.success',
                    data: {
                        currentUser: user
                    }
                })
            } else {
                res.status(404).json({
                    code: 'home/getUser.notFound',
                    message: 'User is not exists'
                });
            }
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
            let userId: number = req.user.id; 
            
            // //pagination varriables
            let pageIndex: number = req.query.page || 1;
            let limit: number = 2;
            let start = limit * (pageIndex - 1);
            let end = start + limit;

            let responseData;
            let type: string = req.query.type || "limit";
            let options = {
                category: req.query.category || null,
                place: req.query.place || null,
                rating: req.query.rating || null
            }

            let filters = {};

            if (type === "all" && (options.category || options.place || options.rating)) {
                filters = {
                    where: {
                        ...(options.place && {"place": options.place}),
                        ...( options.category && {"$Food.Category.name$": options.category})
                    },
                    having: [
                        ...(options.rating ? [sequelize.where(sequelize.col("avgRating"), options.rating)] : [])
                    ]
                }
            }

            let shops: any = await Shop.findAll({
                attributes: [
                    "id",
                    "name",
                    "image",
                    "place",
                    "isTick",
                    "shipFee",
                    [sequelize.literal(`(SELECT IF(shop_likes.id IS NULL, 0, 1) FROM shops LEFT JOIN shop_likes ON shop_likes.shopId = shops.id AND shop_likes.userId = ${userId} WHERE shops.id = Shop.id GROUP BY shops.id)`), 'liked'],
                    [sequelize.fn("COUNT", sequelize.col("Food.Orders.Review.id")), "num_reviews"],
                    [sequelize.literal('(SELECT IF(reviews.id IS NULL, 0, ROUND(AVG(reviews.rating), 0)) FROM shops JOIN foods ON foods.shopId = shops.id LEFT JOIN orders ON orders.foodId = foods.id LEFT JOIN reviews ON reviews.orderId = orders.id WHERE shops.id = Shop.id GROUP BY shops.id)'), 'avgRating']
                ],
                ...filters,
                include: [
                    {
                        model: Food,
                        attributes: [],
                        include: [
                            {
                                model: Category,
                                attributes: [],
                                required: true
                            },
                            {
                                model: Order,
                                attributes: [],
                                required: false,
                                include: [{
                                    model: Review,
                                    attributes: [],
                                    required: false
                                }]
                            }
                        ]
                    },
                ],
                group: [
                    "id"
                ],
                order: [
                    [sequelize.col('num_reviews'), 'DESC'],
                    [sequelize.col('avgRating'), 'DESC'],
                ],
            });

            if (shops.length) {
                if (type === "all" && pageIndex > 0) {
                    responseData = shops.slice(start, end);
                } else {
                    responseData = shops.slice(0, 4);
                }
                res.status(200).json({
                    code: "home/getShop.success",
                    data: responseData,
                    ...(type === "all" && {page: pageIndex})
                });
            } else {
                res.status(404).json({
                    code: "home/getShop.notFound",
                    message: "No shop found"
                });
            }

            
        } catch (error: any) {
            res.status(500).json({
                code: 'home/getUser.error',

                error: error.message
            })
        }
    }

    
}
export default new homeController;