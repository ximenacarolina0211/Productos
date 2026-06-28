require("dotenv").config();

const app = require("./app");
const { bootstrapDatabase } = require("./config/bootstrap");
const sequelize = require("./config/database");

const port = Number(process.env.PORT || 3001);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await sequelize.sync({ alter: true });
    console.log("Database synchronized.");

    await bootstrapDatabase();
    console.log("Initial data verified.");

    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to start backend-marketplace:", error.message);
    process.exit(1);
  }
}

startServer();
