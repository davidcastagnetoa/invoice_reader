import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: process.env.DATABASE_DIALECT || "postgres", // o 'mysql'
  logging: false,
});

export default sequelize;
