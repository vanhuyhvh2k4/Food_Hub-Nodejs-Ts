import sequelize from "../config/sequelize.config";
import { DataTypes } from 'sequelize';
import User from "./User";

const  Shop = sequelize.define("Shop", {
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
  modelName: "Shop",
  tableName: "shops",
  indexes: [
      {
          unique: true,
          fields: ['name']
      }
  ]
});


User.hasOne(Shop, {foreignKey: "userId"})
Shop.belongsTo(User, {foreignKey: "userId", targetKey: "id"});

export default Shop;