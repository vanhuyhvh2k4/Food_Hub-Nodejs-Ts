import { Op } from "sequelize";
import Food from "../Models/Food";
import db from "../config/db.config";
import Shop from "../Models/Shop";
import FoodLike from "../Models/FoodLike";
import Order from "../Models/Order";
import sequelize from "../config/sequelize.config";

class siteController {
    //[GET]baseURL/site/food
    async searchForFood (req: any, res: any) {
        try {
            let foodName: string = req.query.foodName.toLowerCase().trim();
            let foods: any = await Food.findAll({
                where: {
                    name: {
                        [Op.like]: `%${foodName}%`
                    }
                },
                attributes: [
                    "id",
                    "name",
                    "image"
                ]
            });

            if (foods.length) {
                res.status(200).json({
                    code: 'home/search.success',
                    message: 'Success',
                    data: foods
                })
            } else {
                res.status(404).json({
                    code: 'home/search.notFound',
                    message: 'No results found'
                })
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'home/search.error',
                error: error.message
            })
        }
    }

    //[GET] baseUrl/site/food/result
    async getFoodResult (req: any, res: any) {
        try {
            let userId: number = req.user.id;
            let keyword: string = req.query.keyword.toLowerCase().trim();

            let foods =  await Food.findAll({
                where: {
                    name: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                attributes: [
                    "id",
                    "name",
                    "image",
                    "description",
                    "price",
                    [sequelize.fn("COUNT", sequelize.col("Orders.id")), "numOrders"],
                    [sequelize.literal(`(SELECT IF(food_likes.id IS NULL, 0, 1) FROM foods LEFT JOIN food_likes ON food_likes.foodId = foods.id AND food_likes.userId = ${userId} WHERE Food.id = foods.id)`), "liked"]
                ],
                include: [
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
                ]
            });

            if (foods.length) {
                res.status(200).json({
                    code: 'food/searchResult.success',
                    message: 'search result successfully',
                    data: foods
                })
            } else {
                res.status(404).json({
                    code: 'food/searchResult.notFound',
                    message: 'no food found'
                })
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'food/searchResult.error',

                error: error.message
            });
        }
    }
}

export default new siteController;