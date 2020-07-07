import { DataTypeAbstract } from 'sequelize';

type SequelizeAttribute = string | DataTypeAbstract;

declare global {
  type SequelizeAttributes<T extends { [key: string]: any }> = {
    [P in keyof T]: SequelizeAttribute
  };
}
