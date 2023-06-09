import sequelize from '../config/sequelize.config';
import {Model, DataTypes} from 'sequelize';

class User extends Model {}
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},
{ 
    sequelize, 
    modelName: 'User',
    indexes:[
        {
            unique: true,
            fields: ['email']
        },
    ] 
});

export default User;