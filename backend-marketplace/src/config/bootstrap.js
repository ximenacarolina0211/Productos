const bcrypt = require("bcryptjs");
const { Category, Product, Role, User } = require("../models");

const defaultCategories = [
  { nombre: "Laptops" },
  { nombre: "Accesorios" },
  { nombre: "Monitores" },
  { nombre: "Audio" },
  { nombre: "Wearables" },
];

const seededProducts = [
  {
    nombre: "Laptop Lenovo IdeaPad Slim 3",
    precio: 2499.9,
    descripcion:
      "Laptop de 15.6 pulgadas con procesador Intel Core i5, 8 GB de RAM y SSD de 512 GB.",
    imageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Laptops",
  },
  {
    nombre: "Mouse Logitech Pebble 2",
    precio: 89.9,
    descripcion:
      "Mouse inalambrico silencioso con conectividad Bluetooth y receptor USB.",
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Accesorios",
  },
  {
    nombre: "Teclado Mecanico Redragon Kumara",
    precio: 189.9,
    descripcion:
      "Teclado compacto con switches blue y retroiluminacion LED.",
    imageUrl:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Accesorios",
  },
  {
    nombre: "Monitor Samsung ViewFinity 24",
    precio: 799.9,
    descripcion:
      "Monitor Full HD de 24 pulgadas con panel IPS y bordes delgados.",
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Monitores",
  },
  {
    nombre: "Audifonos Sony WH-CH520",
    precio: 229.9,
    descripcion:
      "Audifonos Bluetooth con hasta 50 horas de bateria y carga rapida.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Audio",
  },
  {
    nombre: "Camara Web Logitech C920s",
    precio: 319.9,
    descripcion:
      "Camara web Full HD con doble microfono y tapa de privacidad.",
    imageUrl:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Accesorios",
  },
  {
    nombre: "Smartwatch Xiaomi Mi Band 8",
    precio: 179.9,
    descripcion:
      "Pulsera inteligente con monitoreo de salud y modos deportivos.",
    imageUrl:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Wearables",
  },
];

function inferCategoryName(productName) {
  const name = productName.toLowerCase();

  if (name.includes("laptop")) {
    return "Laptops";
  }

  if (name.includes("monitor")) {
    return "Monitores";
  }

  if (name.includes("audif")) {
    return "Audio";
  }

  if (name.includes("watch") || name.includes("band")) {
    return "Wearables";
  }

  return "Accesorios";
}

function inferImageUrl(productName) {
  const product = seededProducts.find((item) => item.nombre === productName);

  if (product) {
    return product.imageUrl;
  }

  const categoryName = inferCategoryName(productName);
  const categorySeed = seededProducts.find(
    (item) => item.categoryName === categoryName,
  );

  return categorySeed?.imageUrl || seededProducts[0].imageUrl;
}

async function ensureRoles() {
  const [adminRole] = await Role.findOrCreate({
    where: { nombre: "ADMIN" },
    defaults: { nombre: "ADMIN" },
  });
  const [customerRole] = await Role.findOrCreate({
    where: { nombre: "CUSTOMER" },
    defaults: { nombre: "CUSTOMER" },
  });

  return {
    adminRole,
    customerRole,
  };
}

async function ensureCategories() {
  const categories = {};

  for (const category of defaultCategories) {
    const [savedCategory] = await Category.findOrCreate({
      where: { nombre: category.nombre },
      defaults: category,
    });
    categories[savedCategory.nombre] = savedCategory;
  }

  return categories;
}

async function ensureDefaultUser({
  nombre,
  email,
  password,
  roleId,
}) {
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    return existingUser;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return User.create({
    nombre,
    email,
    passwordHash,
    roleId,
  });
}

async function seedProductsIfEmpty(categories) {
  const productCount = await Product.count();

  if (productCount > 0) {
    return;
  }

  await Product.bulkCreate(
    seededProducts.map((product) => ({
      nombre: product.nombre,
      precio: product.precio,
      descripcion: product.descripcion,
      imageUrl: product.imageUrl,
      categoryId: categories[product.categoryName].id,
    })),
  );
}

async function backfillProducts(categories) {
  const products = await Product.findAll();

  for (const product of products) {
    const updates = {};

    if (!product.categoryId) {
      updates.categoryId = categories[inferCategoryName(product.nombre)].id;
    }

    if (!product.imageUrl) {
      updates.imageUrl = inferImageUrl(product.nombre);
    }

    if (Object.keys(updates).length > 0) {
      await product.update(updates);
    }
  }
}

async function bootstrapDatabase() {
  const { adminRole, customerRole } = await ensureRoles();
  const categories = await ensureCategories();

  await ensureDefaultUser({
    nombre: process.env.ADMIN_NAME || "Administrador Demo",
    email: process.env.ADMIN_EMAIL || "admin@marketplace.test",
    password: process.env.ADMIN_PASSWORD || "Admin123*",
    roleId: adminRole.id,
  });

  await ensureDefaultUser({
    nombre: process.env.CUSTOMER_NAME || "Cliente Demo",
    email: process.env.CUSTOMER_EMAIL || "cliente@marketplace.test",
    password: process.env.CUSTOMER_PASSWORD || "Cliente123*",
    roleId: customerRole.id,
  });

  await seedProductsIfEmpty(categories);
  await backfillProducts(categories);
}

module.exports = {
  bootstrapDatabase,
};

