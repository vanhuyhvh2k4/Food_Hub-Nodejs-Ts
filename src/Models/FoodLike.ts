import sequelize from "../config/sequelize.config";
import { Model, DataTypes } from 'sequelize';
import User from "./User";
import Food from "./Food";

class FoodLike extends Model {}
FoodLike.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    foodId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{ 
    sequelize, 
    modelName: 'food_like' 
});

FoodLike.belongsTo(User, {foreignKey: "userId"});
FoodLike.belongsTo(Food, {foreignKey: "foodId"});

export default FoodLike;