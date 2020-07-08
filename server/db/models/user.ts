import {
  Model,
  Optional,
  DataTypes,
  Sequelize,
} from 'sequelize';

// import sequelize from '../index';
// These are all the attributes in the User model
interface UserAttributes {
  id: number
  nameFirst: string
  nameLast: string
  username: string
  password: string
  email: string
  avatar: string
  googleId: string
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatar' | 'nameLast'> { }

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number // Note that the `null assertion` `!` is required in strict mode.

  public nameFirst!: string

  public nameLast: string | null // for nullable fields

  public username!: string

  public password!: string

  public email!: string

  public avatar: string | null

  public googleId!: string

  // timestamps!
  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

export function initUser(sequelize: Sequelize): void {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nameFirst: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      nameLast: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      username: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      password: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      email: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      avatar: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      googleId: {
        type: new DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'users',
      sequelize, // passing the `sequelize` instance is required
    },
  );
}

export default User;
