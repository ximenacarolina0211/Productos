const bcrypt = require("bcryptjs");
const { Category, Product, Role, User } = require("../models");

const defaultCategories = [
  { nombre: "Moda" },
  { nombre: "Belleza" },
  { nombre: "Oficina" },
  { nombre: "Hogar" },
  { nombre: "Tecnologia" },
];

const seededProducts = [
  {
    nombre: "Blazer Ejecutivo Violet",
    precio: 189.9,
    descripcion:
      "Blazer moderno para reuniones, ventas y eventos de negocio.",
    imageUrl:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Moda",
  },
  {
    nombre: "Bolso Tote Premium",
    precio: 149.9,
    descripcion:
      "Bolso amplio con acabado elegante para trabajo diario y compras.",
    imageUrl:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Moda",
  },
  {
    nombre: "Set Skincare Glow",
    precio: 129.9,
    descripcion:
      "Rutina de cuidado facial para una imagen fresca y profesional.",
    imageUrl:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Belleza",
  },
  {
    nombre: "Perfume Aura Morada",
    precio: 169,
    descripcion:
      "Fragancia intensa con notas florales para uso diario o eventos.",
    imageUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Belleza",
  },
  {
    nombre: "Planner Comercial 2026",
    precio: 39.9,
    descripcion:
      "Agenda para organizar pedidos, metas, clientes y reuniones.",
    imageUrl:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Oficina",
  },
  {
    nombre: "Silla Ergonomica Pro",
    precio: 499.9,
    descripcion:
      "Silla comoda para jornadas largas de trabajo y atencion al cliente.",
    imageUrl:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Oficina",
  },
  {
    nombre: "Lampara Decorativa Luna",
    precio: 89.9,
    descripcion:
      "Lampara de mesa con luz calida para espacios modernos.",
    imageUrl:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Hogar",
  },
  {
    nombre: "Difusor Aromatico Zen",
    precio: 99.9,
    descripcion:
      "Difusor compacto para ambientar oficinas, salas y tiendas.",
    imageUrl:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Hogar",
  },
  {
    nombre: "Audifonos Bluetooth Pulse",
    precio: 159.9,
    descripcion:
      "Audifonos inalambricos para llamadas, musica y trabajo movil.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Tecnologia",
  },
  {
    nombre: "Smartwatch Fit Business",
    precio: 219.9,
    descripcion:
      "Reloj inteligente para notificaciones, salud y productividad.",
    imageUrl:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Tecnologia",
  },
  {
    nombre: "Kit Empaque Boutique",
    precio: 59.9,
    descripcion:
      "Bolsas, etiquetas y papel seda para entregar productos con marca.",
    imageUrl:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Oficina",
  },
  {
    nombre: "Set Velas Home Studio",
    precio: 79.9,
    descripcion:
      "Velas decorativas para crear ambientes elegantes en casa o showroom.",
    imageUrl:
      "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1200&q=80",
    categoryName: "Hogar",
  },
];

function inferCategoryName(productName) {
  const name = productName.toLowerCase();

  if (name.includes("blazer") || name.includes("bolso")) {
    return "Moda";
  }

  if (name.includes("skincare") || name.includes("perfume")) {
    return "Belleza";
  }

  if (name.includes("planner") || name.includes("silla") || name.includes("empaque")) {
    return "Oficina";
  }

  if (name.includes("lampara") || name.includes("difusor") || name.includes("velas")) {
    return "Hogar";
  }

  return "Tecnologia";
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
