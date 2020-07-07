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
} from 'sequelize';

import sequelize from '../index';

// These are all the attributes in the User model
interface MessageAttributes {
  id: number
  idParty: string
  message: string
  idSender: string
  idRecipient: string
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'idParty'> { }

class Message extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes {
  public id!: number

  public idParty: string | null

  public message: string

  public idSender: string

  public idRecipient: string
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    idParty: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    message: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    idSender: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    idRecipient: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    tableName: 'messages',
    sequelize, // passing the `sequelize` instance is required
  },
);

export default Message;
