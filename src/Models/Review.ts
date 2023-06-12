import sequelize from "../config/sequelize.config";
import { DataTypes } from 'sequelize';
import Order from "./Order";

const Review = sequelize.define("Review", {
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
}, { modelName: 'Review', tableName: "reviews" });

Order.hasOne(Review, {foreignKey: "orderId"});

Review.belongsTo(Order, {foreignKey: "orderId", targetKey: "id"});

export default Review;
