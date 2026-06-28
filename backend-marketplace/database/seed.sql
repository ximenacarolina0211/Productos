DELETE FROM Products;
DELETE FROM Categories;

INSERT INTO Categories (id, nombre) VALUES
  (1, 'Laptops'),
  (2, 'Accesorios'),
  (3, 'Monitores'),
  (4, 'Audio'),
  (5, 'Wearables');

INSERT INTO Products (id, nombre, precio, descripcion, imageUrl, categoryId) VALUES
  (1, 'Laptop Lenovo IdeaPad Slim 3', 2499.90, 'Laptop de 15.6 pulgadas con procesador Intel Core i5, 8 GB de RAM y SSD de 512 GB.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80', 1),
  (2, 'Mouse Logitech Pebble 2', 89.90, 'Mouse inalambrico silencioso con conectividad Bluetooth y receptor USB.', 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80', 2),
  (3, 'Teclado Mecanico Redragon Kumara', 189.90, 'Teclado compacto con switches blue y retroiluminacion LED.', 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80', 2),
  (4, 'Monitor Samsung ViewFinity 24', 799.90, 'Monitor Full HD de 24 pulgadas con panel IPS y bordes delgados.', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80', 3),
  (5, 'Audifonos Sony WH-CH520', 229.90, 'Audifonos Bluetooth con hasta 50 horas de bateria y carga rapida.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', 4),
  (6, 'Camara Web Logitech C920s', 319.90, 'Camara web Full HD con doble microfono y tapa de privacidad.', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80', 2),
  (7, 'Smartwatch Xiaomi Mi Band 8', 179.90, 'Pulsera inteligente con monitoreo de salud y modos deportivos.', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&q=80', 5),
  (8, 'Laptop ASUS Vivobook 15', 2199.00, 'Laptop con procesador Ryzen 7, 16 GB de RAM y SSD de 512 GB para trabajo y estudio.', 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80', 1),
  (9, 'Base de enfriamiento Cooler Master', 119.90, 'Base con ventiladores duales y altura regulable para laptops.', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80', 2),
  (10, 'Monitor LG UltraWide 29', 1199.00, 'Monitor IPS UltraWide ideal para productividad y multitarea.', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80', 3),
  (11, 'Parlante JBL Flip 6', 459.90, 'Parlante Bluetooth portatil con sonido potente y resistencia al agua.', 'https://images.unsplash.com/photo-1585386959984-a41552231658?auto=format&fit=crop&w=1200&q=80', 4),
  (12, 'Smartwatch Amazfit Bip 5', 329.90, 'Reloj inteligente con GPS, llamadas Bluetooth y monitoreo de salud.', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80', 5),
  (13, 'Hub USB-C Anker 7 en 1', 199.90, 'Hub multipuerto con HDMI, USB 3.0, lector SD y carga PD.', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80', 2),
  (14, 'Audifonos HyperX Cloud Stinger 2', 279.90, 'Headset gamer con sonido espacial y microfono con cancelacion de ruido.', 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=1200&q=80', 4);
