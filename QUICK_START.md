# 🚀 Guía Rápida - Login y Sign In

## ⚡ Inicio Rápido (3 Pasos)

### 1. Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"nombre":"usuario","contrasenna":"password123"}'
```

### 2. Iniciar Sesión (Obtener Token)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nombre":"usuario","contrasenna":"password123"}'
```

### 3. Usar Token en Ruta Protegida
```bash
curl http://localhost:3000/api/juegos \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 📋 Componentes Implementados

| Componente | Ubicación | Descripción |
|-----------|----------|-----------|
| **Rutas de Auth** | `src/routes/auth.routes.ts` | Endpoints `/api/auth/login` y `/api/auth/signin` |
| **Controladores** | `src/controllers/login.controller.ts` | Controlador de login |
| | `src/controllers/signin.controller.ts` | Controlador de registro |
| **Servicios** | `src/services/login.service.ts` | Lógica de autenticación con JWT |
| | `src/services/signin.service.ts` | Lógica de registro con bcrypt |
| **Middleware** | `src/middlewares/autenticacion.middleware.ts` | Validación de JWT para rutas protegidas |
| **Tipos** | `src/types/usuario.types.ts` | Interfaces y tipos actualizados |
| **Modelo** | `src/models/usuario.model.ts` | Schema de MongoDB actualizado |

---

## 🔐 Tecnologías

- ✅ **bcryptjs** - Encriptación de contraseñas
- ✅ **jsonwebtoken** - Generación de tokens JWT
- ✅ **Express** - Framework web
- ✅ **MongoDB** - Base de datos
- ✅ **TypeScript** - Type safety

---

## 📍 Endpoints

```
POST   /api/auth/signin   → Registrar nuevo usuario
POST   /api/auth/login    → Autenticarse y obtener token
```

---

## 🛡️ Proteger una Ruta

```typescript
import { autenticarToken } from '../middlewares/autenticacion.middleware';

router.get('/protegido', autenticarToken, miControlador.miMetodo);
```

---

## 🔑 Variable de Entorno

Asegúrate de tener en `.env`:
```
JWT_SECRET=tu_secreto_jwt_muy_seguro_cambiar_en_produccion
```

---

## 📚 Documentación Completa

- `AUTH_FLOW.md` - Flujo completo y arquitectura
- `AUTH_EXAMPLES.md` - Ejemplos de uso y manejo de errores

---

## ✅ Compilación y Ejecución

```bash
# Compilar TypeScript
npm run build

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

El proyecto debe compilar sin errores. ✨
