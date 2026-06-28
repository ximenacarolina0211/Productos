const { verifyAccessToken } = require("../config/auth");
const { Role, User } = require("../models");

function extractBearerToken(headerValue) {
  if (!headerValue || !headerValue.startsWith("Bearer ")) {
    return null;
  }

  return headerValue.slice(7);
}

async function requireAuth(req, res, next) {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: "No autorizado." });
    }

    const payload = verifyAccessToken(token);
    const user = await User.findByPk(payload.sub, {
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["nombre"],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Sesion invalida." });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Sesion expirada o invalida." });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const roleName = req.user?.role?.nombre;

    if (!roleName || !allowedRoles.includes(roleName)) {
      return res.status(403).json({ message: "No tienes permisos para acceder." });
    }

    return next();
  };
}

module.exports = {
  authorizeRoles,
  requireAuth,
};

