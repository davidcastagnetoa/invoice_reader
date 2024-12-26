import app from "./app.js";
import { config } from "./config/config.js";
import sequelize from "./config/database.js";
import Invoice from "./models/invoiceModel.js";
import User from "./models/userModel.js";

const PORT = config.port || 5000;

let rebootDB = false;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Define las relaciones entre los modelos
    User.hasMany(Invoice, { foreignKey: "user_id", as: "invoices" });
    Invoice.belongsTo(User, { foreignKey: "user_id", as: "user" });

    // Sincroniza los modelos con la base de datos
    if (rebootDB) {
      console.log("Dropping database. Elimina todas las tablas de la base de datos");
    }

    await sequelize.sync({ force: rebootDB });
    console.log("Database synchronized");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
