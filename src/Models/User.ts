import sequelize from '../config/sequelize.config';
import {
    Model,
    DataTypes
} from 'sequelize';

interface UserAttributes {
    id?: number;
    fullName: string;
    email: string;
    phone ? : string;
    address ? : string;
    password ? : string;
    avatar ? : string;
    type?: boolean;
}

class User extends Model < UserAttributes > implements UserAttributes {
    public id!: number;
    public fullName!: string;
    public email!: string;
    public phone ? : string;
    public address ? : string;
    public password ? : string;
    public avatar ? : string;
    public type!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
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
        allowNull: true
    },
    type: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: "User",
    tableName: "users",
    indexes: [{
        unique: true,
        fields: ["email"]
    }]
});

export default User;