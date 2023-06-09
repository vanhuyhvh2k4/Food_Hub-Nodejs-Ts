import sequelize from "../config/sequelize.config";
import { Model, DataTypes } from 'sequelize';
import User from "./User";
import Food from "./Food";

class Order extends Model {}
Order.init({
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
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'waiting confirm'
    }
}, { sequelize, modelName: 'order' });

Order.belongsTo(User, {foreignKey: "userId"});
Order.belongsTo(Food, {foreignKey: "foodId"});

export default Order;
