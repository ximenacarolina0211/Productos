-- Ejecuta este script despues de iniciar el backend al menos una vez,
-- para que Sequelize cree las tablas Roles, Users, Categories y Products.

DELETE FROM Products;
DELETE FROM Categories;

INSERT INTO Categories (id, nombre) VALUES
  (1, 'Laptops'),
  (2, 'Accesorios'),
  (3, 'Monitores'),
  (4, 'Audio'),
  (5, 'Wearables');

INSERT INTO Products (nombre, precio, descripcion, imageUrl, categoryId) VALUES
('Laptop Lenovo IdeaPad 3', 1599.90, 'Laptop basica para estudio y oficina', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80', 1),
('Mouse Logitech M280', 59.90, 'Mouse inalambrico ergonomico', 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80', 2),
('Monitor Samsung 27"', 799.00, 'Monitor Full HD de 27 pulgadas', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80', 3),
('Teclado Redragon Kumara K552', 189.50, 'Teclado mecanico con iluminacion LED', 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80', 2),
('Audifonos Sony WH-CH510', 249.00, 'Audifonos inalambricos con buena autonomia', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', 4),
('Laptop ASUS Vivobook 15', 2199.00, 'Laptop con Ryzen 7, 16 GB de RAM y SSD de 512 GB', 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80', 1),
('Base de enfriamiento Cooler Master', 119.90, 'Base con ventiladores duales y altura regulable para laptops', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80', 2),
('Monitor LG UltraWide 29', 1199.00, 'Monitor IPS UltraWide ideal para productividad y multitarea', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80', 3),
('Parlante JBL Flip 6', 459.90, 'Parlante Bluetooth portatil con sonido potente y resistencia al agua', 'https://images.unsplash.com/photo-1585386959984-a41552231658?auto=format&fit=crop&w=1200&q=80', 4),
('Smartwatch Amazfit Bip 5', 329.90, 'Reloj inteligente con GPS, llamadas Bluetooth y monitoreo de salud', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80', 5),
('Hub USB-C Anker 7 en 1', 199.90, 'Hub multipuerto con HDMI, USB 3.0, lector SD y carga PD', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80', 2),
('Audifonos HyperX Cloud Stinger 2', 279.90, 'Headset gamer con sonido espacial y microfono con cancelacion de ruido', 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=1200&q=80', 4);
