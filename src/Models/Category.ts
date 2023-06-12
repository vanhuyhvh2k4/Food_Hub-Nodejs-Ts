import sequelize from "../config/sequelize.config";
import {
  Model,
  DataTypes
} from 'sequelize';

interface CategoryAttributes {
  id?: number;
  name: string;
}

class Category extends Model < CategoryAttributes > implements CategoryAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
}, {
  sequelize,
  modelName: 'Category',
  tableName: "categories",
  indexes: [{
    unique: true,
    fields: ['name']
  }]
});

export default Category;