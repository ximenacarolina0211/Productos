const { Sequelize } = require("sequelize");

const databaseName = process.env.DB_NAME || process.env.MYSQLDATABASE || "railway";
const databaseUser = process.env.DB_USER || process.env.MYSQLUSER || "root";
const databasePassword =
  process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "";
const databaseHost = process.env.DB_HOST || process.env.MYSQLHOST || "localhost";
const databasePort = Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306);
const mysqlFallbackKeys = {
  DB_NAME: "MYSQLDATABASE",
  DB_USER: "MYSQLUSER",
  DB_HOST: "MYSQLHOST",
  DB_PORT: "MYSQLPORT",
};

const missingEnvVars = ["DB_NAME", "DB_USER", "DB_HOST", "DB_PORT"].filter(
  (key) => !process.env[key] && !process.env[mysqlFallbackKeys[key]],
);

if (missingEnvVars.length > 0) {
  console.warn(
    `Missing database environment variables: ${missingEnvVars.join(", ")}`,
  );
}

const sequelize = new Sequelize(
  databaseName,
  databaseUser,
  databasePassword,
  {
    host: databaseHost,
    port: databasePort,
    dialect: "mysql",
    logging: false,
    dialectOptions:
      process.env.DB_SSL === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : undefined,
  },
);

module.exports = sequelize;
