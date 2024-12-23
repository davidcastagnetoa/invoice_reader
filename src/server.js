import app from "./app.js";
import { config } from "./config/config.js";
import sequelize from "./config/database.js";

const PORT = config.port || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync(); // Sincroniza los modelos con la base de datos
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
