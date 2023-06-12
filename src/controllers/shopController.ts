import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from 'firebase/storage';
import path from 'path';
import db from '../config/db.config';
import Shop from '../Models/Shop';
import Food from '../Models/Food';
import sequelize from '../config/sequelize.config';

class ShopController {

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
    checkShopName(req: any, res: any) {
        try {
            let shopName: string = req.body.shopName.toLowerCase().trim();

            db.query('SELECT * FROM shop WHERE shop.name = ?', ([shopName]), (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {
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
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'error',

                error: error.message
            });
        }
    }

    //[POST] baseUrl/shop/shop
    async create(req: any, res: any) {
        try {
            const userId: number = req.user.id;
            const storage = getStorage();
            const storageRef1 = ref(storage, `shop_image/${userId + path.extname(req.files['avatar'][0].originalname)}`);
            const storageRef2 = ref(storage, `shop_background/${userId + path.extname(req.files['background'][0].originalname)}`);

            //upload the image
            const snapshot1 = await uploadBytesResumable(storageRef1, req.files['avatar'][0].buffer);
            const snapshot2 = await uploadBytesResumable(storageRef2, req.files['background'][0].buffer);
            const name = req.body.name.toLowerCase().trim();
            const address = req.body.address.toLowerCase().trim();
            const shipFee = req.body.shipFee.trim();

            const avatar = await getDownloadURL(snapshot1.ref);
            const background = await getDownloadURL(snapshot2.ref);

            db.query('INSERT INTO `shop`(`userId`, `name`, `image`, `background`, `place`, `shipFee`) VALUES (?,?,?,?,?,?)', ([userId, name, avatar, background, address, shipFee]), (err: any, result: any) => {
                if (err) throw err;
                if (result) {
                    res.status(200).json({
                        code: 'shop/create.success',
                        message: 'Success'
                    })
                } else {
                    res.status(404).json({
                        code: 'shop/create.notFound',
                        message: 'dont found the user'
                    })
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'error',

                error: error.message
            });
        }
    }

    //[PATCH] baseUrl/like/:shopId
    changeLike(req: any, res: any) {
        try {
            const userId: number = req.user.id;
            const shopId: number = req.params.shopId;
            const status: boolean = req.body.statusLike;

            if (status === true) {
                db.query('DELETE FROM shop_like WHERE userId = ? AND shopId = ?', ([userId, shopId]), (err: any, result: any) => {
                    if (err) throw err;
                    if (result) {
                        res.status(200).json({
                            code: 'shop/changeLike.success',
                            message: 'success'
                        });
                    } else {
                        res.status(404).json({
                            code: 'shop/changeLike.notFound',
                            message: 'dont find the user of shop'
                        });
                    }
                })
            } else if (status === false) {
                db.query('INSERT INTO shop_like (userId, shopId) VALUES (?, ?)', ([userId, shopId]), (err: any, result: any) => {
                    if (err) throw err;
                    if (result) {
                        res.status(200).json({
                            code: 'shop/changeLike.success',
                            message: 'success'
                        });
                    } else {
                        res.status(404).json({
                            code: 'shop/changeLike.notFound',
                            message: 'dont find the user of shop'
                        });
                    }
                })
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'shop/changeLike.error',

                error: error.message
            });
        }
    }

    //[GET] baseUrl/shop/checkHasShop
    checkHasShop(req: any, res: any) {
        try {
            const userId: number = req.user.id;

            db.query('SELECT IF(shop.id IS null, 0, 1) as hasShop FROM user LEFT JOIN shop ON shop.userId = user.id WHERE user.id = ?', ([userId]), (err: any, result: any) => {
                if (err) throw err;
                if (result[0].hasShop === 1) {
                    res.status(200).json({
                        code: 'shop/checkHasShop.success.found',
                        message: 'this user has shop'
                    });
                } else if (result[0].hasShop === 0) {
                    res.status(200).json({
                        code: 'shop/checkHasShop.success.notFound',
                        message: 'this user does not have shop'
                    });
                } else {
                    res.status(404).json({
                        code: 'shop/checkHasShop.notFound',
                        message: 'dont find the user'
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'shop/checkHasShop.error',

                error: error.message
            });
        }
    }

    //[GET] baseUrl/shop/favorite
    getFavoriteShop(req: any, res: any) {
        try {
            const userId: number = req.user.id;
            db.query('SELECT COUNT(review.id) AS num_reviews, ROUND(AVG(review.rating), 1) AS avgRating, shop.id, shop.name, shop.image, shop.place, shop.isTick, shop.shipFee, food_item.price, IF(shop_like.id IS NULL, 0, 1) as liked FROM shop  JOIN food_item ON shop.id = food_item.shopId LEFT JOIN food_order ON food_item.id = food_order.foodId LEFT JOIN review ON food_order.id = review.orderId  LEFT JOIN shop_like ON shop_like.shopId = shop.id WHERE shop_like.userId = ? GROUP BY shop.id ORDER BY num_reviews DESC, avgRating DESC LIMIT 5', ([userId]), (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'favorite/getFavoriteShop.success',
                        message: 'Success',
                        data: {
                            shopList: result
                        }
                    })
                } else {
                    res.status(404).json({
                        code: 'favorite/getFavorite.notFound',
                        message: 'Not Found any shop'
                    });
                }
            });
        } catch (error: any) {
            res.status(500).json({
                code: 'favorite/getFavoriteShop.error',

                error: error.message
            })
        }
    }
}

export default new ShopController;