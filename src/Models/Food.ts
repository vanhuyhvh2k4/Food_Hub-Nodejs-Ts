import sequelize from "../config/sequelize.config";
import { Model, DataTypes } from 'sequelize';
import Shop from "./Shop";
import Category from "./Category";

class Food extends Model {}
Food.init({
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
    sequelize, 
    modelName: 'food',
    indexes: [{
        fields: ['name', 'price']
    }] 
});

Food.belongsTo(Shop, {foreignKey: 'shopId'});
Food.belongsTo(Category, {foreignKey: 'categoryId'});

export default Food;