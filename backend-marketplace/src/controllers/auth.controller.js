const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { signAccessToken } = require("../config/auth");
const { Role, User } = require("../models");

function serializeUser(user) {
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    role: user.role?.nombre || user.role,
  };
}

function normalizeAuthPayload(body) {
  return {
    nombre: typeof body.nombre === "string" ? body.nombre.trim() : "",
    email:
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "",
    password: typeof body.password === "string" ? body.password : "",
  };
}

function validateRegisterPayload(payload) {
  if (!payload.nombre) {
    return "El nombre es obligatorio.";
  }

  if (!payload.email) {
    return "El correo electronico es obligatorio.";
  }

  if (payload.password.length < 6) {
    return "La contrasena debe tener al menos 6 caracteres.";
  }

  return null;
}

function validateLoginPayload(payload) {
  if (!payload.email) {
    return "El correo electronico es obligatorio.";
  }

  if (!payload.password) {
    return "La contrasena es obligatoria.";
  }

  return null;
}

async function register(req, res, next) {
  try {
    const payload = normalizeAuthPayload(req.body);
    const validationError = validateRegisterPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await User.findOne({
      where: {
        email: payload.email,
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Ya existe una cuenta con ese correo." });
    }

    const customerRole = await Role.findOne({
      where: { nombre: "CUSTOMER" },
    });

    if (!customerRole) {
      return res
        .status(500)
        .json({ message: "No se encontro el rol CUSTOMER." });
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const createdUser = await User.create({
      nombre: payload.nombre,
      email: payload.email,
      passwordHash,
      roleId: customerRole.id,
    });

    const user = await User.findByPk(createdUser.id, {
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["nombre"],
        },
      ],
    });

    const serializedUser = serializeUser(user);
    const token = signAccessToken(serializedUser);

    return res.status(201).json({
      token,
      user: serializedUser,
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const payload = normalizeAuthPayload(req.body);
    const validationError = validateLoginPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: payload.email,
        },
      },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["nombre"],
        },
      ],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Credenciales invalidas." });
    }

    const passwordMatches = await bcrypt.compare(
      payload.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      return res
        .status(401)
        .json({ message: "Credenciales invalidas." });
    }

    const serializedUser = serializeUser(user);
    const token = signAccessToken(serializedUser);

    return res.json({
      token,
      user: serializedUser,
    });
  } catch (error) {
    return next(error);
  }
}

async function getCurrentUser(req, res) {
  return res.json({
    user: serializeUser(req.user),
  });
}

module.exports = {
  getCurrentUser,
  login,
  register,
};

