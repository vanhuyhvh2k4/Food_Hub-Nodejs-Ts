import sequelize from "../config/sequelize.config";
import {
  Model,
  DataTypes
} from 'sequelize';
import User from "./User";

interface ShopAttributes {
  id?: number;
  userId: number;
  name: string;
  image: string;
  background: string;
  place: string;
  isTick?: boolean;
  shipFee: number;
}

class Shop extends Model < ShopAttributes > implements ShopAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public image!: string;
  public background!: string;
  public place!: string;
  public isTick!: boolean;
  public shipFee!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Shop.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  background: {
    type: DataTypes.STRING,
    allowNull: false
  },
  place: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isTick: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  shipFee: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "Shop",
  tableName: "shops",
  indexes: [{
    unique: true,
    fields: ['name']
  }]
});


User.hasOne(Shop, {
  foreignKey: "userId"
})
Shop.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id"
});

export default Shop;