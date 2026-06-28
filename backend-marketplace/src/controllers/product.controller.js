const { Category, Product } = require("../models");

const productInclude = [
  {
    model: Category,
    as: "category",
    attributes: ["id", "nombre"],
  },
];

function serializeProduct(product) {
  const data = product.toJSON();

  return {
    id: data.id,
    nombre: data.nombre,
    precio: Number(data.precio),
    descripcion: data.descripcion,
    imageUrl: data.imageUrl,
    categoryId: data.categoryId,
    category: data.category || null,
  };
}

function normalizePayload(body) {
  return {
    nombre: typeof body.nombre === "string" ? body.nombre.trim() : "",
    precio: Number(body.precio),
    descripcion:
      typeof body.descripcion === "string" ? body.descripcion.trim() : "",
    imageUrl:
      typeof body.imageUrl === "string" ? body.imageUrl.trim() : "",
    categoryId: Number(body.categoryId),
  };
}

function validatePayload(payload) {
  if (!payload.nombre) {
    return "El campo nombre es obligatorio.";
  }

  if (Number.isNaN(payload.precio) || payload.precio <= 0) {
    return "El campo precio debe ser un numero mayor a 0.";
  }

  if (!payload.descripcion) {
    return "El campo descripcion es obligatorio.";
  }

  if (!payload.imageUrl) {
    return "El campo imageUrl es obligatorio.";
  }

  try {
    new URL(payload.imageUrl);
  } catch (_error) {
    return "El campo imageUrl debe ser una URL valida.";
  }

  if (!Number.isInteger(payload.categoryId) || payload.categoryId <= 0) {
    return "Debes seleccionar una categoria valida.";
  }

  return null;
}

async function ensureCategoryExists(categoryId) {
  return Category.findByPk(categoryId);
}

async function getProducts(req, res, next) {
  try {
    const categoryId = req.query.categoryId
      ? Number(req.query.categoryId)
      : null;

    if (req.query.categoryId && (!Number.isInteger(categoryId) || categoryId <= 0)) {
      return res
        .status(400)
        .json({ message: "El filtro de categoria no es valido." });
    }

    const products = await Product.findAll({
      where: categoryId ? { categoryId } : undefined,
      include: productInclude,
      order: [["id", "ASC"]],
    });

    return res.json(products.map(serializeProduct));
  } catch (error) {
    return next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: productInclude,
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    return res.json(serializeProduct(product));
  } catch (error) {
    return next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const payload = normalizePayload(req.body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const category = await ensureCategoryExists(payload.categoryId);

    if (!category) {
      return res
        .status(400)
        .json({ message: "La categoria seleccionada no existe." });
    }

    const createdProduct = await Product.create(payload);
    const createdProductWithCategory = await Product.findByPk(createdProduct.id, {
      include: productInclude,
    });

    return res.status(201).json(serializeProduct(createdProductWithCategory));
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    const payload = normalizePayload(req.body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const category = await ensureCategoryExists(payload.categoryId);

    if (!category) {
      return res
        .status(400)
        .json({ message: "La categoria seleccionada no existe." });
    }

    await product.update(payload);
    const updatedProduct = await Product.findByPk(product.id, {
      include: productInclude,
    });

    return res.json(serializeProduct(updatedProduct));
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    await product.destroy();

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
};

