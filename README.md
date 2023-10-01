# API Rest con NestJS

Esta es una API Rest desarrollada con NestJS que proporciona funcionalidades para la gestión de productos y pedidos, así como autenticación de usuarios.

## Funcionalidades

- **Productos**: Puedes realizar operaciones CRUD (Crear, Leer, Actualizar y Borrar) para gestionar productos. Ten en cuenta que la creación, actualización y eliminación de productos están deshabilitadas por defecto por razones de seguridad. Si deseas habilitar estas operaciones, puedes hacerlo siguiendo las instrucciones en el código fuente.

- **Pedidos**: También puedes realizar operaciones CRUD para gestionar pedidos. La eliminación y actualización de pedidos están deshabilitadas por defecto, pero puedes habilitarlas si lo deseas.

- **Autenticación**: La API admite autenticación de usuarios con funciones de registro y inicio de sesión. Utiliza JSON Web Tokens (JWT) para mantener a los usuarios autenticados.

- **Seguridad**: Se han implementado medidas de seguridad para limitar las acciones permitidas, como el acceso a los pedidos, que solo pueden ser vistos por el usuario que los creó.

## Requisitos

Asegúrate de tener instalado Node.js y npm en tu sistema antes de continuar.

## Instalación

1. Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/andresdrew02/nestjs-basic-product-api
```

2. Navega al directorio del proyecto:

```bash
cd nestjs-basic-product-api
```

3. Instala las dependencias:

```bash
npm install
```

## Configuración

1. Abre el archivo `config.ts` en la raíz del proyecto y configura las opciones de base de datos y JWT según tus necesidades. (Por defecto está configurado con SQLite3)

2. Si deseas habilitar las operaciones de creación, actualización y eliminación de productos o pedidos, busca las secciones correspondientes en los controladores y descomenta las líneas necesarias en el código fuente.

## Uso

1. Inicia la aplicación:

```bash
npm start
```

2. La API estará disponible en `http://localhost:3000` de forma predeterminada. Puedes modificar el puerto en el archivo de configuración si es necesario.

## Endpoints

A continuación, se enumeran los principales puntos finales de la API:

- `GET /api/products`: Obtener la lista de productos.
- `GET /api/productos`: Obtener un producto por su ID. (Revistar los filtros en el código).
- `POST /api/products`: Crear un nuevo producto (habilitar en la configuración si es necesario).
- `PUT /api/products/:id`: Actualizar un producto existente (habilitar en la configuración si es necesario).
- `DELETE /api/products/:id`: Eliminar un producto existente (habilitar en la configuración si es necesario).
- `DELETE /api/products/2?force=true` : Eliminar un producto existente junto a todos sus pedidos (habilitar en la configuración si es necesario).
- `GET /api/orders`: Obtener la lista de pedidos.
- `GET /api/orders/:id`: Obtener un pedido por su ID.
- `POST /api/orders`: Crear un nuevo pedido.
- `PUT /api/orders/:id`: Actualizar un pedido existente (habilitar en la configuración si es necesario).
- `DELETE /api/orders/`: Eliminar un pedido existente (habilitar en la configuración si es necesario).

- `POST /api/auth/register`: Registrar un nuevo usuario y obtener un token JWT.
- `POST /api/auth/login`: Iniciar sesión y obtener un token JWT.

## Contribución

Si deseas contribuir a este proyecto, ¡estamos encantados de recibir tus contribuciones! Por favor, sigue los estándares de codificación y envía tus solicitudes de extracción.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para obtener más detalles.

---

¡Gracias por usar esta API Rest desarrollada con NestJS! Si tienes alguna pregunta o problema, no dudes en crear un problema o ponerte en contacto con el equipo de desarrollo.