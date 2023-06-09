import sequelize from "../config/sequelize.config";
import { Model, DataTypes } from 'sequelize';
import User from "./User";
import Shop from "./Shop";

class ShopLike extends Model {}
ShopLike.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shopId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { sequelize, modelName: 'shop_like' });

ShopLike.belongsTo(User, { foreignKey: "userId"});
ShopLike.belongsTo(Shop, { foreignKey: "shopId"});

export default ShopLike;