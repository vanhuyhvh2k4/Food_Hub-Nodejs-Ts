import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from 'firebase/storage';
import path from 'path';
import sequelize from '../config/sequelize.config';

import Shop from '../Models/Shop';
import Food from '../Models/Food';
import Category from '../Models/Category';
import Order from '../Models/Order';
import Review from '../Models/Review';
import ShopLike from '../Models/ShopLike';

class ShopController {

    //[GET] baseURL/shop
    async getListShop (req: any, res: any) {
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

    //[GET] baseURL/shop/:shopId
    async getShopInfo(req: any, res: any) {
        try {
            let shopId: number = req.params.shopId;

            let shop = await Shop.findOne({
                where: {
                    id: shopId
                },
                attributes: [
                    "id",
                    "name",
                    "image",
                    "background",
                    "place",
                    "isTick",
                    [sequelize.fn("COUNT", sequelize.col("Food.id")), "quantity"]
                ],
                include: [{
                    model: Food,
                    attributes: [],
                    required: true
                }],
                group: [
                    "id"
                ]
            });

            if (shop) {
                res.status(200).json({
                    code: 'shop/getInfo.success',
                    data: shop
                })
            } else {
                res.status(404).json({
                    code: 'shop/getInfo.dontFound',
                    message: 'No shop found',
                });
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'shop/getInfo.error',

                error: error.message
            })
        }
    }

    //[POST] baseUrl/shop/checkShopName
    async checkShopName(req: any, res: any) {
        try {
            let shopName: string = req.body.shopName.toLowerCase().trim();

            let shop = await Shop.findOne({
                where: {
                    name: shopName
                }
            });

            if (shop) {
                res.status(409).json({
                    code: 'shop/checkName.conflict',
                    message: 'The name is already exists',
                })
            } else {
                res.status(200).json({
                    code: 'shop/checkName.success',
                    message: 'The name is valid'
                });
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'error',

                error: error.message
            });
        }
    }

    //[POST] baseUrl/shop/
    async createShop (req: any, res: any) {
        try {
            let userId: number = req.user.id;
            let storage = getStorage();
            let storageRef1 = ref(storage, `shop_image/${userId + path.extname(req.files['avatar'][0].originalname)}`);
            let storageRef2 = ref(storage, `shop_background/${userId + path.extname(req.files['background'][0].originalname)}`);

            //upload the image
            let snapshot1 = await uploadBytesResumable(storageRef1, req.files['avatar'][0].buffer);
            let snapshot2 = await uploadBytesResumable(storageRef2, req.files['background'][0].buffer);
            let name = req.body.name.toLowerCase().trim();
            let address = req.body.address.toLowerCase().trim();
            let shipFee = req.body.shipFee.trim();

            let avatar = await getDownloadURL(snapshot1.ref);
            let background = await getDownloadURL(snapshot2.ref);

            let [shop, created] = await Shop.findOrCreate({
                where: {
                    userId,
                },
                defaults: {
                    userId,
                    name,
                    image: avatar,
                    background,
                    place: address,
                    shipFee
                }
            });

            if (created) {
                res.status(409).json({
                    code: "shop.createShop.forbidden",
                    message: "You already created a shop before"
                });
            } else {
                res.status(200).json({
                    code: "shop.createShop.success",
                    message: "Shop created successfully"
                });
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'error',

                error: error.message
            });
        }
    }

    //[PATCH] baseUrl/like/:shopId
    async changeLike(req: any, res: any) {
        try {
            let userId: number = req.user.id;
            let shopId: number = req.params.shopId;
            let status: boolean = req.body.statusLike;

            if (status === true) {
                await ShopLike.destroy({
                    where: {
                        userId,
                        shopId,
                    }
                });
                res.status(200).json({
                    code: 'shop/changeLike.success',
                    message: 'success'
                });
            } else if (status === false) {
                await ShopLike.create({
                    userId,
                    shopId
                });
                res.status(200).json({
                    code: 'shop/changeLike.success',
                    message: 'success'
                });
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'shop/changeLike.error',

                error: error.message
            });
        }
    }

    //[GET] baseUrl/shop/checkHasShop
    async checkHasShop(req: any, res: any) {
        try {
            let userId: number = req.user.id;

            let shop = await Shop.findOne({
                where: {
                    userId
                }
            });

            if (shop) {
                res.status(200).json({
                    code: 'shop/checkHasShop.success.found',
                    message: 'this user has shop'
                });
            } else {
                res.status(404).json({
                    code: 'shop/checkHasShop.notFound',
                    message: 'no shop found'
                });
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'shop/checkHasShop.error',

                error: error.message
            });
        }
    }

    //[GET] baseUrl/shop/like
    async getFavoriteShop(req: any, res: any) {
        try {
            let userId: number = req.user.id;
            let shops = await Shop.findAll({
                where: {
                    "$ShopLikes.userId$": userId
                },
                attributes: [
                    "id",
                    "name",
                    "image",
                    "place",
                    "isTick",
                    "shipFee",
                ],
                include: [{
                    model: ShopLike,
                    attributes: [],
                    required: true
                }]
            });

            if (shops.length) {
                res.status(200).json({
                    code: 'favorite/getFavoriteShop.success',
                    message: 'Success',
                    data: shops
                })
            } else {
                res.status(404).json({
                    code: 'favorite/getFavorite.notFound',
                    message: 'You not like any shop'
                });
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'favorite/getFavoriteShop.error',
                error: error.message
            })
        }
    }
}

export default new ShopController;