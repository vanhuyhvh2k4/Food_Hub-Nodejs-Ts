import { Sequelize } from "sequelize";

const sequelize = new Sequelize('food_hub_sequelize', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

export default sequelize;