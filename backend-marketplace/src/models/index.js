const Category = require("./Category");
const Product = require("./Product");
const Role = require("./Role");
const User = require("./User");

Role.hasMany(User, {
  foreignKey: "roleId",
  as: "users",
});

User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});

Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

module.exports = {
  Category,
  Product,
  Role,
  User,
};

