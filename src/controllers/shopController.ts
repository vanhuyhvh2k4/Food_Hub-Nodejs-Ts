import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from 'firebase/storage';
import path from 'path';
import db from '../config/db.config';

class ShopController {

    //[GET] baseURL/shop/info
    getInfo(req: any, res: any) {
        try {
            const shopName: string = req.query.shopName;

            db.query('SELECT shop.id, shop.name, shop.image, shop.background, shop.place, shop.isTick, COUNT(food_item.id) as quantity FROM food_item JOIN shop ON shop.id = food_item.shopId WHERE shop.name = ?', ([shopName]), (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'shop/getInfo.success',
                        message: 'Success',
                        data: result[0]
                    })
                } else {
                    res.status(404).json({
                        code: 'shop/getInfo.dontFound',
                        message: 'No shop found',
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'shop/getInfo.error',

                error: error.message
            })
        }
    }

    //[GET] baseURL/shop/food
    getFood(req: any, res: any) {
        try {
            const userId: number = req.user.id;
            const shopName: string = req.query.shopName;
            db.query('SELECT food_item.id, food_item.name, food_item.image, food_item.description, food_item.price, IF (food_like.id IS null, 0, 1) AS liked FROM food_item JOIN shop ON shop.id = food_item.shopId LEFT JOIN food_like ON food_like.foodId = food_item.id AND food_like.userId = ? WHERE shop.name = ?', ([userId, shopName]), (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'shop/getFood.success',
                        message: 'Success',
                        data: {
                            foodList: result
                        }
                    });
                } else {
                    res.status(404).json({
                        code: 'shop/getFood.notFound',
                        message: 'Not found the food',
                    });
                }
            });
        } catch (error: any) {
            res.status(500).json({
                code: 'shop/getFood.error',

                error: error.message
            });
        }
    }

    //[POST] baseUrl/shop/checkShopName
    checkShopName(req: any, res: any) {
        try {
            const shopName: string = req.body.shopName;
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
            const name = req.body.name;
            const address = req.body.address;
            const shipFee = req.body.shipFee;
            const timeShipping = req.body.timeShipping;

            const avatar = await getDownloadURL(snapshot1.ref);
            const background = await getDownloadURL(snapshot2.ref);

            db.query('INSERT INTO `shop`(`userId`, `name`, `image`, `background`, `place`, `shipFee`, `timeShipping`) VALUES (?,?,?,?,?,?,?)', ([userId, name, avatar, background, address, shipFee, timeShipping]), (err: any, result: any) => {
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
            db.query('SELECT shop.id, shop.name, shop.image, shop.isTick, shop.shipFee, shop.timeShipping FROM shop JOIN shop_like ON shop_like.shopId = shop.id JOIN user ON user.id = shop_like.userId WHERE shop_like.userId = ?', ([userId]), (err: any, result: any) => {
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