import sequelize from "../config/sequelize.config";
import { Model, DataTypes } from 'sequelize';
import User from "./User";
import Food from "./Food";

class Cart extends Model {}
Cart.init({
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
}, { sequelize, modelName: 'cart' });

Cart.belongsTo(User, {foreignKey: "userId"});
Cart.belongsTo(Food, {foreignKey: "foodId"});

export default Cart;
