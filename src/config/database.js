import { Sequelize } from "sequelize";
import { config } from "./config.js";

let databaseHost = config.databaseDevelopmentHost;
let databaseUser = config.databaseDevelopmentUser;
let databasePassword = config.databaseDevelopmentPassword;

if (config.environment === "development") {
  databaseHost = config.databaseDevelopmentHost;
  databaseUser = config.databaseDevelopmentUser;
  databasePassword = config.databaseDevelopmentPassword;
  console.log("Configuración de la base de datos en localhost:3306");
} else {
  databaseHost = config.databaseProductionHost;
  databaseUser = config.databaseProductionUser;
  databasePassword = config.databaseProductionPassword;
  console.log("Configuración de la base de datos en RDS");
}

const databaseUrl = `${config.databaseDialect}://${databaseUser}:${databasePassword}@${databaseHost}:${config.databasePort}/${config.databaseName}`;

const sequelize = new Sequelize(databaseUrl, {
  dialect: config.databaseDialect || "mysql",
  logging: false,
});

export default sequelize;
