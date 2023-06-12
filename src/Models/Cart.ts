import sequelize from "../config/sequelize.config";
import {
    Model,
    DataTypes
} from 'sequelize';
import User from "./User";
import Food from "./Food";

interface CartAttributes {
    id?: number;
    userId: number;
    foodId: number;
    quantity: number;
}

class Cart extends Model < CartAttributes > implements CartAttributes {
    public id!: number;
    public userId!: number;
    public foodId!: number;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

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
}, {
    sequelize,
    modelName: 'Cart',
    tableName: "carts"
});

Food.hasMany(Cart, {
    foreignKey: "foodId"
});

Cart.belongsTo(Food, {
    foreignKey: "foodId",
    targetKey: "id"
});

User.hasMany(Cart, {
    foreignKey: "userId"
});

Cart.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id"
});

export default Cart;