import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} from 'firebase/storage'
import { Op } from 'sequelize';

import path from 'path';
import sequelize from '../config/sequelize.config';

import Food from '../Models/Food';
import Shop from '../Models/Shop';
import Category from '../Models/Category';
import Order from '../Models/Order';
import FoodLike from '../Models/FoodLike';

class FoodController {

    //[GET] baseURL/food
    async getListFood (req: any, res: any) {
        try {
            let userId: number = req.user.id;
            let foodType: string = req.query.foodType.toLowerCase().trim();

            let foods: any = await Food.findAll({
                attributes: [
                    "id",
                    "name",
                    "image",
                    "description",
                    "price",
                    [sequelize.col("Shop.place"), "place"],
                    [sequelize.literal("(SELECT IF(orders.id IS NULL, 0, COUNT(orders.id)) FROM foods LEFT JOIN orders ON orders.foodId = foods.id WHERE Food.id = foods.id)"), "numOrders"],
                    [sequelize.literal(`(SELECT IF(food_likes.id IS NULL, 0, 1) FROM foods LEFT JOIN food_likes ON food_likes.foodId = foods.id AND food_likes.userId = ${userId} WHERE Food.id = foods.id)`), "liked"]
                ],
                where: {
                    "$Category.name$": foodType
                },
                include: [
                    {
                        model: Category,
                        attributes: [],
                        required: true
                    },
                    {
                        model: Shop,
                        attributes: [],
                        required: true
                    },
                    {
                        model: Order,
                        attributes: [],
                        required: false
                    }
                ],
                group: [
                    "id"
                ],
                order: [
                    [sequelize.col("numOrders"), "DESC"]
                ]
            });

            if (foods.length) {
                res.status(200).json({
                    code: "home/getFood.success",
                    data: foods
                });
            } else {
                res.status(404).json({
                    code: "home/getFood.notFound",
                    message: "No food found"
                });
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'home/getUser.error',

                error: error.message
            })
        }
    }

    //[GET] baseURL/food/:foodId
    async getFoodInfo (req: any, res: any) {
        try {
            let foodId: number = req.params.foodId;

            let food: any = await Food.findOne({
                where: {
                    id: foodId
                },
                attributes: [
                    "id",
                    "name",
                    "image",
                    "description",
                    "price",
                    [sequelize.col("Shop.name"), "shopName"],
                    [sequelize.col("Shop.image"), "shopImage"],
                    [sequelize.col("Shop.place"), "place"],
                    [sequelize.col("Shop.isTick"), "isTick"],
                ],
                include: [{
                    model: Shop,
                    attributes: [],
                    required: true
                }]
            });

            if (food) {
                res.status(200).json({
                    code: 'food/getFood.success',
                    data: food
                });

            } else {
                res.status(404).json({
                    code: 'food/getFood.notFound',
                    message: 'dont found food',
                });
            }
        } catch (error: any) {
            res.status(500).json([{
                code: 'food/getFood.error',
                error: error.message
            }])
        }
    }

    //[PATCH] baseUrl/food/like/:foodId
    async changeLike(req: any, res: any) {
        try {
            let userId: number = req.user.id;
            let foodId: string = req.params.foodId;
            let status: boolean = req.body.statusLike;

            if (status === true) {
                await FoodLike.destroy({
                    where: {
                        [Op.and]: [{foodId}, {userId}]
                    }
                });
            } else if (status === false) {
                await FoodLike.create({
                   foodId,
                   userId 
                })
            }

            res.status(200).json({
                code: 'food/changeLike.success',
                message: 'success',
            });
        } catch (error: any) {
            res.status(500).json({
                code: 'food/changeLike.error',
                error: error.message
            });
        }
    }

    //[POST] baseUrl/food
    async createNewFood (req: any, res: any) {
        try {
            let userId: number = req.user.id;
            let name: string = req.body.name.toLowerCase().trim();
            let categoryId: number = req.body.categoryId;
            let description: string = req.body.description.toLowerCase().trim();
            let price: number = req.body.price;

            let storage = getStorage();
            let storageRef = ref(storage, `food_image/${userId}-${name}${path.extname(req.file.originalname)}`);

            //get shop id
            let shop: any = await Shop.findOne({
                attributes: ["id"],
                where: {
                    userId
                }
            });

            if (shop) {
                //upload
                let snapshot = await uploadBytesResumable(storageRef, req.file.buffer);
                let url = await getDownloadURL(snapshot.ref);

                await Food.create({
                    foodCategoryId: categoryId,
                    shopId : shop.id,
                    name,
                    image: url,
                    description,
                    price
                });

                res.status(200).json({
                    code: 'food/createNewFood.success',
                    message: 'add food successfully'
                });
            } else {
                res.status(404).json({
                    code: 'food/newFood.notFound',
                    message: 'User does not have shop'
                });
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'food/newFood.error',
                error: error.message
            })
        }
    }

    //[GET] baseURL/food/favorite
    async getLikedFoods (req: any, res: any) {
        try {
            let userId: number = req.user.id;

            let foods = await Food.findAll({
                where: {
                    "$FoodLikes.userId$": userId
                },
                attributes: [
                    "id",
                    "name",
                    "image",
                    "description",
                    "price",
                    [sequelize.col("Shop.name"), "shopName"],

                ],
                include: [
                    {
                    model: Shop,
                    attributes: [],
                    required: true
                    },
                    {
                        model: FoodLike,
                        attributes: [],
                        required: true
                    }
            ]
            });

            if (foods.length) {
                res.status(200).json({
                    code: 'favorite/getFoodFavorite.success',
                    message: 'Success',
                    data: foods
                })
            } else {
                res.status(404).json({
                    code: 'favorite/getFoodFavorite.notFound',
                    message: 'User does not like any foods'
                })
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'favorite/getFoodFavorite.error',
                error: error.message
            })
        }
    }
}

export default new FoodController;