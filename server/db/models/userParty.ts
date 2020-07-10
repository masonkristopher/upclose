import {
  Model,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
  DataTypes,
  Sequelize,
} from 'sequelize';

import { User } from './user';
import { Party } from './party';

interface UserPartyAttributes {
  id: number
  idUser: number
  idParty: number
  createdAt: Date
  updatedAt: Date
}

export class UserParty extends Model<UserPartyAttributes>
  implements UserPartyAttributes {
  public id!: number

  public idUser: number

  public idParty: number

  public readonly createdAt: Date;

  public readonly updatedAt: Date;

  public getParties!: HasManyGetAssociationsMixin<Party>; // Note the null assertions!

  public addParty!: HasManyAddAssociationMixin<Party, number>;

  public hasParty!: HasManyHasAssociationMixin<Party, number>;

  public countParty!: HasManyCountAssociationsMixin;

  public createParty!: HasManyCreateAssociationMixin<Party>

  public getUsers!: HasManyGetAssociationsMixin<User>; // Note the null assertions!

  public addUser!: HasManyAddAssociationMixin<User, number>;

  public hasUser!: HasManyHasAssociationMixin<User, number>;

  public countUser!: HasManyCountAssociationsMixin;

  public createUser!: HasManyCreateAssociationMixin<User>

  public static associations: {
    projects: Association<User, Party>;
  };
}

export function initUserParty(sequelize: Sequelize): void {
  UserParty.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idParty:
      {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE(),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE(),
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'userParties',
      sequelize, // passing the `sequelize` instance is required
    },
  );
}

export function associateUserParty(): void {
  User.belongsToMany(Party, { through: 'UserParty', foreignKey: 'idUser' });
  Party.belongsToMany(User, { through: 'UserParty', foreignKey: 'idParty' });
}
