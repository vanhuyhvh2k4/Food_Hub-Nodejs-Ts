import sequelize from "../config/sequelize.config";
import { Model, DataTypes } from 'sequelize';
import Order from "./Order";

class Review extends Model {}
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
}, { sequelize, modelName: 'review' });

Review.belongsTo(Order, {foreignKey: "orderId"});

export default Review;
