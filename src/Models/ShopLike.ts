import sequelize from "../config/sequelize.config";
import { DataTypes } from 'sequelize';
import User from "./User";
import Shop from "./Shop";

const ShopLike = sequelize.define("ShopLike", {
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
}, { modelName: 'ShopLike', tableName: "shop_likes" });

User.hasMany(ShopLike, {foreignKey: "userId"});

ShopLike.belongsTo(User, {foreignKey: "userId", targetKey: "id"});

Shop.hasMany(ShopLike, {foreignKey: "shopId"});

ShopLike.belongsTo(Shop, {foreignKey: "shopId", targetKey: "id"});

export default ShopLike;