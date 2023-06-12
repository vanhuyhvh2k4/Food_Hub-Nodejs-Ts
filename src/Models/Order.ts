import sequelize from "../config/sequelize.config";
import {
    Model,
    DataTypes
} from 'sequelize';
import User from "./User";
import Food from "./Food";

interface OrderAttributes {
    id?: number;
    userId: number;
    foodId: number;
    quantity: number;
    status: string;
}

class Order extends Model < OrderAttributes > implements OrderAttributes {
    public id!: number;
    public userId!: number;
    public foodId!: number;
    public quantity!: number;
    public status!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

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
}, {
    sequelize,
    modelName: 'Order',
    tableName: "orders"
});

Food.hasMany(Order, {
    foreignKey: "foodId"
});

Order.belongsTo(Food, {
    foreignKey: "foodId",
    targetKey: "id"
});

User.hasMany(Order, {
    foreignKey: "userId"
});

Order.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id"
});

export default Order;