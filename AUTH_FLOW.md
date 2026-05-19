# Flujo de Autenticación - Login y Sign In

## 📋 Descripción General

Este documento describe el flujo completo de autenticación, incluyendo registro (Sign In) y inicio de sesión (Login) con contraseñas encriptadas y tokens JWT.

## 🔒 Características de Seguridad

- ✅ Contraseñas encriptadas con **bcryptjs** (10 rondas de salt)
- ✅ Autenticación con **JWT** (JSON Web Tokens)
- ✅ Tokens con expiración de 24 horas
- ✅ Middleware de validación de tokens

## 📐 Estructura del Flujo

```
┌─────────────────────────────────────────────────────┐
│          CLIENTE (Mobile/Web)                       │
└────────────────┬────────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌────────┐  ┌────────┐  ┌──────────┐
│ SIGNIN │  │ LOGIN  │  │ REQUEST  │
│ENDPOINT│  │ENDPOINT│  │ PROTEGIDO│
└───┬────┘  └───┬────┘  └──────┬───┘
    │           │              │
    ▼           ▼              ▼
┌─────────────────────────┐  ┌──────────────────┐
│   Validar Datos         │  │ Enviar Token JWT │
│   Encriptar Contraseña  │  │ en Authorization │
│   Guardar en BD         │  │ Header: Bearer   │
│   Generar Token JWT     │  └──────────────────┘
└─────────────────────────┘
```

## 🚀 Endpoints

### 1. Sign In (Registro de Usuario)

**Método:** `POST`  
**URL:** `/api/auth/signin`  
**Content-Type:** `application/json`

#### Request Body:
```json
{
  "nombre": "usuario_ejemplo",
  "contrasenna": "miPassword123"
}
```

#### Response (201 Created):
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "usuario_ejemplo"
  }
}
```

#### Errores Posibles:
- **400**: Nombre o contraseña vacíos / Contraseña < 6 caracteres
- **409**: Usuario ya existe

---

### 2. Login (Autenticación)

**Método:** `POST`  
**URL:** `/api/auth/login`  
**Content-Type:** `application/json`

#### Request Body:
```json
{
  "nombre": "usuario_ejemplo",
  "contrasenna": "miPassword123"
}
```

#### Response (200 OK):
```json
{
  "mensaje": "Autenticación exitosa",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsIm5vbWJyZSI6InVzdWFyaW9fZWplbXBsbyIsImlhdCI6MTcxNjE4MDEyMywiZXhwIjoxNzE2MjY2NTIzfQ.8wEkT3Xq9oY1aZ2bC3dE4fG5hI6jK7lM8nO9pQ0rS1t",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "usuario_ejemplo"
  }
}
```

#### Errores Posibles:
- **400**: Nombre o contraseña vacíos
- **401**: Usuario o contraseña incorrectos

---

### 3. Rutas Protegidas (Ejemplo)

Para acceder a rutas protegidas, envía el token en el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🛠️ Cómo Usar el Middleware de Autenticación

```typescript
import { Router } from 'express';
import { autenticarToken } from '../middlewares/autenticacion.middleware';
import * as MiController from '../controllers/mi.controller';

const router = Router();

// Ruta protegida - requiere token válido
router.get('/', autenticarToken, MiController.getAll);

export default router;
```

---

## 📝 Flujo Paso a Paso

### Paso 1: Registro (Sign In)
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "juan",
    "contrasenna": "password123"
  }'
```

### Paso 2: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "juan",
    "contrasenna": "password123"
  }'
```

**Obtienes un token JWT**

### Paso 3: Usar el Token para Acceder a Rutas Protegidas
```bash
curl -X GET http://localhost:3000/api/juegos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔐 Variables de Entorno

Añade a tu `.env`:

```env
JWT_SECRET=tu_secreto_muy_seguro_cambiar_en_produccion
PORT=3000
```

**⚠️ IMPORTANTE:** En producción, cambia `JWT_SECRET` a un valor seguro y aleatorio.

---

## 📁 Archivos Creados/Modificados

### Creados:
- `src/routes/auth.routes.ts` - Rutas de autenticación
- `src/routes/login.routes.ts` - Rutas de login
- `src/routes/signin.routes.ts` - Rutas de signin
- `src/middlewares/autenticacion.middleware.ts` - Middleware JWT

### Modificados:
- `src/services/login.service.ts` - Servicio de autenticación
- `src/services/signin.service.ts` - Servicio de registro
- `src/controllers/login.controller.ts` - Controlador de login
- `src/controllers/signin.controller.ts` - Controlador de signin
- `src/types/usuario.types.ts` - Tipos actualizados
- `src/config/server.routes.ts` - Registro de rutas

### Dependencias Instaladas:
- `bcryptjs` - Encriptación de contraseñas
- `jsonwebtoken` - Generación y validación de JWT
- `@types/bcryptjs` - Tipos TypeScript
- `@types/jsonwebtoken` - Tipos TypeScript

---

## 🧪 Pruebas

Puedes usar **Postman** o **curl** para probar:

1. **POST** `/api/auth/signin` → Registrar usuario
2. **POST** `/api/auth/login` → Obtener token
3. Usar el token en **Authorization Header** → `Bearer TOKEN`

---

## 🔄 Flujo de Autenticación Completo

1. **Usuario se registra** → `POST /api/auth/signin`
   - Contraseña se encripta y se guarda en BD
   
2. **Usuario inicia sesión** → `POST /api/auth/login`
   - Se verifica la contraseña encriptada
   - Se genera un JWT con duración de 24h
   
3. **Usuario accede a recursos protegidos**
   - Envía el token en el header `Authorization: Bearer TOKEN`
   - El middleware `autenticarToken` valida el token
   - Si es válido, accede al recurso; si no, recibe error 401

---

## 💡 Próximos Pasos (Opcional)

- Implementar **refresh tokens** para renovar sesiones
- Agregar **2FA** (Two-Factor Authentication)
- Implementar **roles y permisos**
- Agregar **logout** (invalidar tokens)
- Usar **cookies seguras** en lugar de headers
