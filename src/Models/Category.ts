import sequelize from "../config/sequelize.config";
import { Model, DataTypes } from 'sequelize';

class Category extends Model {}
Category.init({
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
    sequelize,
    modelName: 'category',
    indexes: [
        {
            unique: true,
            fields: ['name']
        }
    ] 
});

export default Category;