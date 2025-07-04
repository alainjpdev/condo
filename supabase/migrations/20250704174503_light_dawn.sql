/*
  # Datos de prueba para desarrollo

  1. Datos iniciales
    - Perfil de administrador
    - Unidades de ejemplo
    - Áreas comunes
    - Proveedores de servicios
    - Votaciones activas

  2. Nota importante
    - Estos datos son solo para desarrollo
    - En producción se deben crear a través de la aplicación
*/

-- Insertar áreas comunes
INSERT INTO common_areas (name, description, usage_rules, capacity, hourly_rate) VALUES
  ('Salón de Eventos', 'Amplio salón para celebraciones y reuniones', 'Prohibido fumar. Máximo 50 personas. Horario: 8:00 AM - 11:00 PM', 50, 25.00),
  ('Piscina', 'Piscina climatizada con área de descanso', 'Uso bajo supervisión. Niños menores de 12 años con adulto responsable', 30, 15.00),
  ('Gimnasio', 'Gimnasio equipado con máquinas y pesas', 'Usar toalla obligatoria. Limpiar equipos después del uso', 15, 10.00),
  ('Terraza BBQ', 'Área de parrillas con vista panorámica', 'Traer carbón propio. Limpiar después del uso', 20, 20.00),
  ('Cancha de Tenis', 'Cancha profesional de tenis', 'Reservar con 24 horas de anticipación. Máximo 2 horas por reserva', 4, 12.00),
  ('Sala de Juegos', 'Sala con mesa de pool, ping pong y juegos de mesa', 'Mantener orden y limpieza. Niños con supervisión', 12, 8.00);

-- Insertar proveedores de servicios
INSERT INTO service_providers (name, phone, email, category, rating, description) VALUES
  ('Electricidad Total', '+507 6000-1234', 'info@electricidadtotal.com', 'electricista', 4.8, 'Servicio eléctrico 24/7 especializado en edificios residenciales'),
  ('Plomería Express', '+507 6000-5678', 'contacto@plomeriaexpress.com', 'plomero', 4.6, 'Reparaciones de plomería y mantenimiento de sistemas hidráulicos'),
  ('Limpieza Premium', '+507 6000-9012', 'ventas@limpiezapremium.com', 'limpieza', 4.9, 'Servicio de limpieza profesional para áreas comunes y oficinas'),
  ('Jardines del Istmo', '+507 6000-3456', 'info@jardinesistmo.com', 'jardineria', 4.7, 'Mantenimiento de jardines y áreas verdes'),
  ('Seguridad Integral', '+507 6000-7890', 'operaciones@seguridadintegral.com', 'seguridad', 4.5, 'Servicios de seguridad y vigilancia para condominios'),
  ('Servicios Varios PA', '+507 6000-2468', 'contacto@serviciosvariospa.com', 'otros', 4.3, 'Servicios generales de mantenimiento y reparaciones menores');

-- Insertar unidades de ejemplo
INSERT INTO units (name, type, floor, cuota_mensual) VALUES
  ('Depto 101', 'departamento', 1, 450.00),
  ('Depto 102', 'departamento', 1, 450.00),
  ('Depto 103', 'departamento', 1, 520.00),
  ('Depto 201', 'departamento', 2, 480.00),
  ('Depto 202', 'departamento', 2, 480.00),
  ('Depto 203', 'departamento', 2, 550.00),
  ('Depto 301', 'departamento', 3, 510.00),
  ('Depto 302', 'departamento', 3, 510.00),
  ('Depto 303', 'departamento', 3, 580.00),
  ('Local 01', 'local', 0, 800.00),
  ('Local 02', 'local', 0, 750.00),
  ('Oficina 401', 'oficina', 4, 600.00),
  ('Oficina 402', 'oficina', 4, 650.00),
  ('Oficina 403', 'oficina', 4, 700.00),
  ('Penthouse', 'departamento', 5, 1200.00);

-- Insertar votación de ejemplo
INSERT INTO votes (title, description, options, start_date, end_date, created_by) VALUES
  ('Mejoras en el Área de Piscina', 
   'Votación para decidir las mejoras que se realizarán en el área de la piscina durante el próximo trimestre.',
   '["Instalar nuevas sombrillas", "Renovar el deck de madera", "Agregar jacuzzi", "Mejorar la iluminación nocturna"]',
   now(),
   now() + interval '30 days',
   (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1));