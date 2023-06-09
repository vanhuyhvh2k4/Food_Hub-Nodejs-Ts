import db from '../config/db.config';

class SearchController {

    //[POST]baseURL/search/
    search(req: any, res: any) {
        try {
            const foodName: string = req.query.foodName.toLowerCase().trim();
            if (foodName.length) {
                db.query('SELECT id, name, image FROM food_item WHERE name LIKE ? GROUP BY name', [`%${foodName}%`], (err: any, result: any) => {
                    if (err) throw err;

                    if (!result.length) {
                        res.status(404).json({
                            code: 'home/search.notFound',
                            message: 'No results found'
                        })
                    } else {
                        res.status(200).json({
                            code: 'home/search.success',
                            message: 'Success',
                            data: result
                        })
                    }
                });
            }
        } catch (error: any) {
            res.status(500).json({
                code: 'home/search.error',

                error: error.message
            })
        }
    }

    //[GET] baseUrl/search/result
    result(req: any, res: any) {
        try {
            const userId: number = req.user.id;
            const keyword: string = req.query.keyword.toLowerCase().trim();

            db.query('SELECT food_item.id, shop.name AS shopName, shop.place, food_item.name, food_item.image, food_item.description, food_item.price, IF(food_like.id IS NULL, 0, 1) AS liked, COUNT(food_order.id) AS numOrders FROM food_item JOIN shop ON shop.id = food_item.shopId LEFT JOIN food_like ON food_like.foodId = food_item.id AND food_like.userId = ? LEFT JOIN food_order ON food_order.foodId = food_item.id AND food_order.status = "finished" WHERE food_item.name LIKE ? GROUP BY food_item.id ORDER BY numOrders DESC', ([userId, `%${keyword}%`]), (err: any, result: any) => {
                if (err) throw err;
                if (result.length) {
                    res.status(200).json({
                        code: 'food/searchResult.success',
                        message: 'search result successfully',
                        data: result
                    })
                } else {
                    res.status(404).json({
                        code: 'food/searchResult.notFound',
                        message: 'search result not found'
                    })
                }
            })
        } catch (error: any) {
            res.status(500).json({
                code: 'food/searchResult.error',

                error: error.message
            });
        }
    }
}

export default new SearchController;