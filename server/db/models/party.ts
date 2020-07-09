import {
  Model,
  Optional,
  DataTypes,
  Sequelize,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';

import Message from './message';
import { User } from './user';

interface PartyAttributes {
  id: number
  name: string
  idLayout: number
  createdAt: Date
  updatedAt: Date
}

interface PartyCreationAttributes extends Optional<PartyAttributes, 'id'> { }

export class Party extends Model<PartyAttributes, PartyCreationAttributes>
  implements PartyAttributes {
  public id!: number;

  public name: string;

  public idLayout: number;

  public readonly createdAt: Date;

  public readonly updatedAt: Date;

  public addUser!: HasManyAddAssociationMixin<User, number>;

  public static associations: {
    parties: Association<Party, User>
  };
}

export function initParty(sequelize: Sequelize): void {
  Party.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      idLayout: {
        type: new DataTypes.INTEGER(),
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
      tableName: 'parties',
      sequelize, // passing the `sequelize` instance is required
    },
  );
}

export function associatePartyMessages(): void {
  Party.hasMany(Message, {
    sourceKey: 'id',
    foreignKey: 'idParty',
    as: 'messages',
  });
}
