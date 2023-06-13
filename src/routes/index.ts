import dotenv from 'dotenv';
dotenv.config();
import authRouter from './auth.route';
import foodRouter from './food.route';
import shopRouter from './shop.route';
import checkoutRouter from './checkout.route';
import ratingRouter from './rating.route';
import siteRouter from './site.route';

const baseUrl = process.env.BASE_URL;

function routes (app: any) {

    app.use(`${baseUrl}/site`, siteRouter);

    app.use(`${baseUrl}/auth`, authRouter);

    app.use(`${baseUrl}/food`, foodRouter);

    app.use(`${baseUrl}/shop`, shopRouter);

    app.use(`${baseUrl}/checkout`, checkoutRouter);

    app.use(`${baseUrl}/rating`, ratingRouter);
}

export default routes;