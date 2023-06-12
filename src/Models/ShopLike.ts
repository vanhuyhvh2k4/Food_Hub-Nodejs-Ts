import sequelize from "../config/sequelize.config";
import {
    Model,
    DataTypes
} from 'sequelize';
import User from "./User";
import Shop from "./Shop";

interface ShopLikeAttributes {
    id?: number;
    userId: number;
    shopId: number;
}

class ShopLike extends Model < ShopLikeAttributes > implements ShopLikeAttributes {
    public id!: number;
    public userId!: number;
    public shopId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

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
}, {
    sequelize,
    modelName: 'ShopLike',
    tableName: "shop_likes"
});

User.hasMany(ShopLike, {
    foreignKey: "userId"
});

ShopLike.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id"
});

Shop.hasMany(ShopLike, {
    foreignKey: "shopId"
});

ShopLike.belongsTo(Shop, {
    foreignKey: "shopId",
    targetKey: "id"
});

export default ShopLike;