import sequelize from "../config/sequelize.config";
import {
    Model,
    DataTypes
} from 'sequelize';
import Order from "./Order";

interface ReviewAttributes {
    id?: number;
    orderId: number;
    rating: number;
    comment: string;
}

class Review extends Model < ReviewAttributes > implements ReviewAttributes {
    public id!: number;
    public orderId!: number;
    public rating!: number;
    public comment!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Review.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Review',
    tableName: "reviews"
});
Order.hasOne(Review, {
    foreignKey: "orderId"
});

Review.belongsTo(Order, {
    foreignKey: "orderId",
    targetKey: "id"
});

export default Review;