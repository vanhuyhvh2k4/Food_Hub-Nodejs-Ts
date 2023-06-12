import sequelize from "../config/sequelize.config";
import { DataTypes } from 'sequelize';
import User from "./User";
import Food from "./Food";
import Review from "./Review";

const Order = sequelize.define("Order", {
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
}, { modelName: 'Order', tableName: "orders" });

Food.hasMany(Order, {foreignKey: "foodId"});

Order.belongsTo(Food, {foreignKey: "foodId", targetKey: "id"});

User.hasMany(Order, {foreignKey: "userId"});

Order.belongsTo(User, {foreignKey: "userId", targetKey: "id"});

export default Order;
