import sequelize from "../config/sequelize.config";
import {
  Model,
  DataTypes
} from 'sequelize';
import Shop from "./Shop";
import Category from "./Category";

interface FoodAttributes {
  id?: number;
  categoryId: number;
  shopId: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

class Food extends Model < FoodAttributes > implements FoodAttributes {
  public id!: number;
  public categoryId!: number;
  public shopId!: number;
  public name!: string;
  public image!: string;
  public description!: string;
  public price!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Food',
  tableName: "foods",
  indexes: [{
    fields: ['name', 'price']
  }]
});

Shop.hasMany(Food, {
  foreignKey: "shopId"
});

Food.belongsTo(Shop, {
  foreignKey: "shopId",
  targetKey: "id"
});

Category.hasMany(Food, {
  foreignKey: "categoryId"
});

Food.belongsTo(Category, {
  foreignKey: "categoryId",
  targetKey: "id"
});

export default Food;