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

interface MessageAttributes {
  id: number
  idParty: string
  message: string
  idSender: number
  idRecipient: number
  createdAt: Date
  updatedAt: Date
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'idParty'> { }

class Message extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes {
  public id!: number

  public idParty: string | null

  public message: string

  public idSender: number

  public idRecipient: number

  public readonly createdAt: Date;

  public readonly updatedAt: Date;
}

export function initMessage(sequelize: Sequelize): void {
  Message.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      idParty: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      message: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      idSender: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      idRecipient: {
        type: DataTypes.INTEGER.UNSIGNED,
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
      tableName: 'messages',
      sequelize, // passing the `sequelize` instance is required
    },
  );
}
export function associateMessage():
  void {
  Message.belongsTo(User, {
    foreignKey: 'idSender',
  });
  User.hasMany(Message, {
    foreignKey: 'id',
  });
  Message.belongsTo(User, {
    foreignKey: 'idRecipient',
  });
  User.hasMany(Message, {
    foreignKey: 'id',
  });
}

export default Message;
