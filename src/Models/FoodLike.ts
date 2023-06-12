import sequelize from "../config/sequelize.config";
import { DataTypes } from 'sequelize';
import User from "./User";
import Food from "./Food";

const FoodLike = sequelize.define("FoodLike", {
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
    modelName: 'FoodLike', 
    tableName: "food_likes"
});

User.hasMany(FoodLike, {foreignKey: "userId"});

FoodLike.belongsTo(User, {foreignKey: "userId", targetKey: "id"});

Food.hasMany(FoodLike, {foreignKey: "foodId"});

FoodLike.belongsTo(Food, {foreignKey: "foodId", targetKey: "id"});

export default FoodLike;