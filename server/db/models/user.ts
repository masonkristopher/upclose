import {
  Model,
  Optional,
} from 'sequelize';
// These are all the attributes in the User model
interface UserAttributes {
  id: number;
  nameFirst: string
  nameLast: string | null;
  username: string
  password: string
  email: string
  avatar: string
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public nameFirst!: string;

  public nameLast!: string | null; // for nullable fields

  public username!: string;

  public password!: string;

  public email!: string;

  public avatar!: string;

  // timestamps!
  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
}

export default User;
