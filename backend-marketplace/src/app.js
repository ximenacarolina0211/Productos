const cors = require("cors");
const express = require("express");
const authRouter = require("./routes/auth");
const categoriesRouter = require("./routes/categories");
const productsRouter = require("./routes/products");

const app = express();
const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URLS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ].filter(Boolean),
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
  }),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "backend-marketplace" });
});

app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Ruta no encontrada." });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ message: error.errors[0]?.message });
  }

  return res.status(500).json({
    message: error.message || "Ocurrio un error interno en el servidor.",
  });
});

module.exports = app;
