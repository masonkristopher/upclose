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

import { Message } from './message';
import { User } from './user';

interface PartyAttributes {
  id: number
  name: string
  idLayout: number
  idCreator: number
  roomOneBackground: string
  roomTwoBackground: string
  roomThreeBackground: string
  roomFourBackground: string
  idRoomOne: string
  idRoomTwo: string
  idRoomThree: string
  idRoomFour: string
  inviteOnly: boolean
  createdAt: Date
  updatedAt: Date
}

interface PartyCreationAttributes extends Optional<PartyAttributes, 'id'> { }

export class Party extends Model<PartyAttributes, PartyCreationAttributes>
  implements PartyAttributes {
  public id!: number;

  public name: string;

  public idLayout: number;

  public idCreator: number;

  public roomOneBackground: string;

  public roomTwoBackground: string;

  public roomThreeBackground: string;

  public roomFourBackground: string;

  public idRoomOne: string;
  
  public idRoomTwo: string;
  
  public idRoomThree: string;
  
  public idRoomFour: string;

  public inviteOnly!: boolean;

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
      idCreator: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      roomOneBackground: {
        type: new DataTypes.STRING(250),
        allowNull: false,
        defaultValue: 'red',
      },
      roomTwoBackground: {
        type: new DataTypes.STRING(250),
        allowNull: false,
        defaultValue: 'blue',
      },
      roomThreeBackground: {
        type: new DataTypes.STRING(250),
        allowNull: false,
        defaultValue: 'green',
      },
      roomFourBackground: {
        type: new DataTypes.STRING(250),
        allowNull: false,
        defaultValue: 'yellow',
      },
      idRoomOne: {
        type: new DataTypes.STRING(10),
        allowNull: false,
      },
      idRoomTwo: {
        type: new DataTypes.STRING(10),
        allowNull: false,
      },
      idRoomThree: {
        type: new DataTypes.STRING(10),
        allowNull: false,
      },
      idRoomFour: {
        type: new DataTypes.STRING(10),
        allowNull: false,
      },
      inviteOnly: {
        type: DataTypes.BOOLEAN,
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

export function associateIdCreator(): void {
  User.hasMany(Party, {
    sourceKey: 'id',
    foreignKey: 'idCreator',
  });
}
