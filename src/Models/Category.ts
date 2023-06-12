import sequelize from "../config/sequelize.config";
import { DataTypes } from 'sequelize';
import Food from "./Food";

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, 
{
    modelName: 'Category',
    tableName: "categories",
    indexes: [
        {
            unique: true,
            fields: ['name']
        }
    ] 
});

export default Category;