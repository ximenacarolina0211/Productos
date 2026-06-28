const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "change-this-secret";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
      nombre: user.nombre,
    },
    jwtSecret,
    {
      expiresIn: jwtExpiresIn,
    },
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = {
  jwtExpiresIn,
  jwtSecret,
  signAccessToken,
  verifyAccessToken,
};

