import sequelize from "../config/sequelize.config";
import { Model, DataTypes } from 'sequelize';
import User from "./User";

class Shop extends Model {}
Shop.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  background: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  place: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isTick: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  shipFee: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, 
{ 
    sequelize,
    modelName: 'shop',
    indexes: [
        {
            unique: true,
            fields: ['name']
        }
    ]
});

Shop.belongsTo(User, {foreignKey: 'userId'});

export default Shop;