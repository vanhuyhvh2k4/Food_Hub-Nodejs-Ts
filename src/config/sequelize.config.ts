import { Sequelize } from "sequelize";
import "dotenv/config";

const DB_HOST: string = process.env.DB_HOST!;
const DB_NAME: string = process.env.DB_NAME!;
const DB_USER: string = process.env.DB_USER!;
const DB_PASSWORD: string = process.env.DB_PASSWORD!;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql'
});

export default sequelize;