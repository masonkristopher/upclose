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

interface PartyAttributes {
  id: number
  name: string
  idLayout: number
}

interface PartyCreationAttributes extends Optional<PartyAttributes, 'id'> { }

class Party extends Model<PartyAttributes, PartyCreationAttributes>
  implements PartyAttributes {
  public id!: number

  public name: string

  public idLayout: number
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
    },
    {
      tableName: 'parties',
      sequelize, // passing the `sequelize` instance is required
    },
  );
}
export default Party;
