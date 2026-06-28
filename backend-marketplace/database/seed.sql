DELETE FROM Products;
DELETE FROM Categories;

INSERT INTO Categories (id, nombre) VALUES
  (1, 'Moda'),
  (2, 'Belleza'),
  (3, 'Oficina'),
  (4, 'Hogar'),
  (5, 'Tecnologia');

INSERT INTO Products (id, nombre, precio, descripcion, imageUrl, categoryId) VALUES
  (1, 'Blazer Ejecutivo Violet', 189.90, 'Blazer moderno para reuniones, ventas y eventos de negocio.', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80', 1),
  (2, 'Bolso Tote Premium', 149.90, 'Bolso amplio con acabado elegante para trabajo diario y compras.', 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80', 1),
  (3, 'Set Skincare Glow', 129.90, 'Rutina de cuidado facial para una imagen fresca y profesional.', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80', 2),
  (4, 'Perfume Aura Morada', 169.00, 'Fragancia intensa con notas florales para uso diario o eventos.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80', 2),
  (5, 'Planner Comercial 2026', 39.90, 'Agenda para organizar pedidos, metas, clientes y reuniones.', 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80', 3),
  (6, 'Silla Ergonomica Pro', 499.90, 'Silla comoda para jornadas largas de trabajo y atencion al cliente.', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1200&q=80', 3),
  (7, 'Lampara Decorativa Luna', 89.90, 'Lampara de mesa con luz calida para espacios modernos.', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80', 4),
  (8, 'Difusor Aromatico Zen', 99.90, 'Difusor compacto para ambientar oficinas, salas y tiendas.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80', 4),
  (9, 'Audifonos Bluetooth Pulse', 159.90, 'Audifonos inalambricos para llamadas, musica y trabajo movil.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', 5),
  (10, 'Smartwatch Fit Business', 219.90, 'Reloj inteligente para notificaciones, salud y productividad.', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80', 5),
  (11, 'Kit Empaque Boutique', 59.90, 'Bolsas, etiquetas y papel seda para entregar productos con marca.', 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80', 3),
  (12, 'Set Velas Home Studio', 79.90, 'Velas decorativas para crear ambientes elegantes en casa o showroom.', 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1200&q=80', 4);
