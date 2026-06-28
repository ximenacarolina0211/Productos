const { Sequelize } = require("sequelize");

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.MYSQL_PUBLIC_URL ||
  process.env.MYSQL_URL;

let databaseName =
  process.env.DB_NAME ||
  process.env.MYSQLDATABASE ||
  process.env.MYSQL_DATABASE ||
  "railway";
let databaseUser = process.env.DB_USER || process.env.MYSQLUSER || "root";
let databasePassword = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "";
let databaseHost = process.env.DB_HOST || process.env.MYSQLHOST || "localhost";
let databasePort = Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306);

if (databaseUrl) {
  const parsedDatabaseUrl = new URL(databaseUrl);

  databaseName = parsedDatabaseUrl.pathname.replace(/^\//, "") || databaseName;
  databaseUser = decodeURIComponent(parsedDatabaseUrl.username) || databaseUser;
  databasePassword =
    decodeURIComponent(parsedDatabaseUrl.password) || databasePassword;
  databaseHost = parsedDatabaseUrl.hostname || databaseHost;
  databasePort = Number(parsedDatabaseUrl.port || databasePort);
}

const mysqlFallbackKeys = {
  DB_NAME: ["MYSQLDATABASE", "MYSQL_DATABASE"],
  DB_USER: ["MYSQLUSER"],
  DB_HOST: ["MYSQLHOST"],
  DB_PORT: ["MYSQLPORT"],
};

const missingEnvVars = databaseUrl
  ? []
  : ["DB_NAME", "DB_USER", "DB_HOST", "DB_PORT"].filter(
      (key) =>
        !process.env[key] &&
        !mysqlFallbackKeys[key].some((fallbackKey) => process.env[fallbackKey]),
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
