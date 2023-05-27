import { FieldPacket } from "mysql2";
import db from "../config/db.config";

class ratingController {
    //[GET] baseUrl/rating/review/:foodId
    getReview (req: any, res: any) {
        try {
            const foodId: number = req.params.foodId;

            db.query('SELECT review.id, review.rating, review.comment, review.timestamp, user.fullName, user.avatar, shop.name, shop.isTick FROM review JOIN food_order ON food_order.id = review.orderId JOIN user ON user.id = food_order.userId LEFT JOIN shop ON shop.userId = user.id WHERE food_order.foodId = ? ORDER BY review.timestamp DESC', [foodId], (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {
                    let response = result.map((item: any) => {
                        let id: number = item.id;
                        let rating: number = item.rating;
                        let comment: string = item.comment;
                        let time = new Date(item.timestamp);
                        let formatTime: string = time.toLocaleDateString().replace(',', '');
                        let fullName: string = item.fullName;
                        let avatar: string = item.avatar;
                        let shopName: string = item.name;
                        let isTick: boolean = item.isTick;

                        return {
                            id,
                            rating,
                            comment,
                            time: formatTime,
                            fullName,
                            avatar,
                            shopName,
                            isTick
                        }
                    })

                    res.status(200).json({
                        code: 'rating/getReview.success',
                        data: {
                            list: response
                        }
                    });
                } else {
                    res.status(404).json({
                        code: 'rating/getReview.notFound',
                        message: 'Not Found any comment'
                    });
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'rating/getReview.error',
                error: error.message
            });
        }
    }
}

export default new ratingController;