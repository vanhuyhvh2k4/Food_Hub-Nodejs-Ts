import sequelize from "../config/sequelize.config";
import {
    Model,
    DataTypes
} from 'sequelize';
import User from "./User";
import Food from "./Food";

interface FoodLikeAttributes {
    id?: number;
    userId: number;
    foodId: number;
}

class FoodLike extends Model < FoodLikeAttributes > implements FoodLikeAttributes {
    public id!: number;
    public userId!: number;
    public foodId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

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
}, {
    sequelize,
    modelName: 'FoodLike',
    tableName: "food_likes"
});

User.hasMany(FoodLike, {
    foreignKey: "userId"
});

FoodLike.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id"
});

Food.hasMany(FoodLike, {
    foreignKey: "foodId"
});

FoodLike.belongsTo(Food, {
    foreignKey: "foodId",
    targetKey: "id"
});

export default FoodLike;