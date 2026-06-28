const { Category } = require("../models");

async function getCategories(_req, res, next) {
  try {
    const categories = await Category.findAll({
      order: [["nombre", "ASC"]],
    });

    return res.json(categories);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCategories,
};

