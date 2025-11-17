# Microservicios con Docker Compose

Este proyecto es una práctica de arquitectura de microservicios orquestada con Docker Compose. Incluye:
- user-service (Node.js + Express + PostgreSQL)
- order-service (Node.js + Express + PostgreSQL, consume user-service)
- proxy (NGINX como puerta de enlace)
- PostgreSQL (base de datos compartida)

El proxy expone un único punto de entrada y enruta el tráfico a cada microservicio.

## Estructura del Proyecto
/PRACTICAMICROSERVICIOS
 ├── order-service/
 │    ├── Dockerfile
 │    ├── index.js
 │    └── package.json
 ├── user-service/
 │    ├── Dockerfile
 │    ├── index.js
 │    └── package.json
 ├── proxy/
 │    ├── Dockerfile
 │    └── nginx.conf
 └── docker-compose.yml

## Descripción de los microservicios
🔹 user-service: Microservicio encargado de la gestión de usuarios. Incluye un pequeño servidor en Node.js que expone un endpoint básico para retornar información del servicio o de usuarios.

🔹 order-service: Microservicio independiente que gestiona pedidos (orders). También está desarrollado en Node.js y expone sus propios endpoints.

## Cada microservicio:

- Tiene su propio Dockerfile

- Sus dependencias aisladas

- Se ejecuta en su propio contenedor

La carpeta proxy/ contiene:

Dockerfile del contenedor Nginx

nginx.conf: archivo de configuración que funciona como un reverse proxy

## El proxy cumple el rol de puerta de entrada a los microservicios:

Redirige /users → user-service

Redirige /orders → order-service

## Docker Compose

El archivo docker-compose.yml se encarga de:

- Crear una red interna para que los servicios se comuniquen

- Construir cada imagen usando su Dockerfile

- Levantar todos los contenedores con un solo comando

- Exponer el proxy en un puerto accesible desde el navegador

## Endpoints (a través del proxy)

Usuarios (redirecciona a user-service):
- Listar usuarios
  - GET http://localhost:8083/usuarios/users
- Obtener usuario por id
  - GET http://localhost:8083/usuarios/users/1
- Crear usuario
  - POST http://localhost:8083/usuarios/users
  - Body JSON:
```json
{ "name": "Alice", "email": "alice@example.com" }
```

Órdenes (redirecciona a order-service):
- Listar órdenes
  - GET http://localhost:8083/ordenes/orders
- Crear orden (requiere un user_id válido)
  - POST http://localhost:8083/ordenes/orders
  - Body JSON:
```json
{ "user_id": 1, "item": "Laptop", "qty": 2 }
```

Notas:
- El proxy define rutas con barra final (/usuarios/ y /ordenes/). Los paths del servicio se agregan después (por ejemplo, /usuarios/ + users → /usuarios/users).

## Puertos directos

Además del proxy, los servicios exponen puertos en el host:
- user-service: http://localhost:3001
- order-service: http://localhost:3002

## Cómo ejecutar el proyecto:

1️) Levantar los contenedores
docker compose up --build

2️) Levantar en segundo plano
docker compose up -d

3) Punto de entrada:
Base URL: http://localhost:8083

4) Detener la aplicación
docker compose down










