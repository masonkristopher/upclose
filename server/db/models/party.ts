import {
  Model,
  Optional,
  DataTypes,
  Sequelize,
} from 'sequelize';

import Message from './message';

interface PartyAttributes {
  id: number
  name: string
  idLayout: number
  createdAt: Date
  updatedAt: Date
}

interface PartyCreationAttributes extends Optional<PartyAttributes, 'id'> { }

class Party extends Model<PartyAttributes, PartyCreationAttributes>
  implements PartyAttributes {
  public id!: number

  public name: string

  public idLayout: number

  public readonly createdAt: Date;

  public readonly updatedAt: Date;
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

export default Party;
