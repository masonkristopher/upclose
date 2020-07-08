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

interface MessageAttributes {
  id: number
  idParty: string
  message: string
  idSender: number
  idRecipient: number
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'idParty'> { }

class Message extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes {
  public id!: number

  public idParty: string | null

  public message: string

  public idSender: number

  public idRecipient: number
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
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      message: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      idSender: {
        type: new DataTypes.INTEGER(),
        allowNull: false,
      },
      idRecipient: {
        type: new DataTypes.INTEGER(),
        allowNull: false,
      },
    },
    {
      tableName: 'messages',
      sequelize, // passing the `sequelize` instance is required
    },
  );
}

export default Message;
