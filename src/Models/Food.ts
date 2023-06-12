import sequelize from "../config/sequelize.config";
import { DataTypes } from 'sequelize';
import Shop from "./Shop";
import Category from "./Category";
import Order from "./Order";

const Food = sequelize.define("Food", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  shopId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
},
{
    modelName: 'Food',
    tableName: "foods",
    indexes: [{
        fields: ['name', 'price']
    }] 
});

Shop.hasMany(Food, {foreignKey: "shopId"});

Food.belongsTo(Shop, {foreignKey: "shopId", targetKey: "id"});

Category.hasMany(Food, {foreignKey: "categoryId"});

Food.belongsTo(Category, {foreignKey: "categoryId", targetKey: "id"});

export default Food;