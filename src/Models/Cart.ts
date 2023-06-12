import sequelize from "../config/sequelize.config";
import { DataTypes } from 'sequelize';
import User from "./User";
import Food from "./Food";

const Cart = sequelize.define("Cart", {
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
    }
}, { modelName: 'Cart', tableName: "carts" });

Food.hasMany(Cart, {foreignKey: "foodId"});

Cart.belongsTo(Food, {foreignKey: "foodId", targetKey: "id"});

User.hasMany(Cart, {foreignKey: "userId"});

Cart.belongsTo(User, {foreignKey: "userId", targetKey: "id"});

export default Cart;
