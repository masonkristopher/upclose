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

import User from './user';
import Party from './party';

interface UserPartyAttributes {
  id: number
  idUser: number
  idParty: number
}

class UserParty extends Model<UserPartyAttributes>
  implements UserPartyAttributes {
  public id!: number

  public idUser: number

  public idParty: number
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
    },
    {
      tableName: 'userParties',
      sequelize, // passing the `sequelize` instance is required
    },
  );
}

export function associateUserParty() {
  User.belongsToMany(Party, { through: 'UserParty', foreignKey: 'idUser' });
  Party.belongsToMany(User, { through: 'UserParty', foreignKey: 'idParty' });
}

export default UserParty;
