# Ejemplos Prácticos - Login y Sign In

## 🖥️ Ejemplos con cURL

### 1️⃣ Registrar un Usuario (Sign In)

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "juan_perez",
    "contrasenna": "MiPassword123"
  }'
```

**Respuesta (201 Created):**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "juan_perez"
  }
}
```

---

### 2️⃣ Iniciar Sesión (Login)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "juan_perez",
    "contrasenna": "MiPassword123"
  }'
```

**Respuesta (200 OK):**
```json
{
  "mensaje": "Autenticación exitosa",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsIm5vbWJyZSI6Imp1YW5fcGVyZXoiLCJpYXQiOjE3MTYxODAxMjMsImV4cCI6MTcxNjI2NjUyM30.8wEkT3Xq9oY1aZ2bC3dE4fG5hI6jK7lM8nO9pQ0rS1t",
  "usuario": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "juan_perez"
  }
}
```

---

### 3️⃣ Guardar el Token y Usarlo

```bash
# Guardar el token en una variable
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Usar el token en un endpoint protegido
curl -X GET http://localhost:3000/api/juegos \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚫 Ejemplos de Errores

### Error 1: Usuario o Contraseña Vacíos (Sign In)

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "",
    "contrasenna": "password123"
  }'
```

**Response (400 Bad Request):**
```json
{
  "error": "El nombre y la contraseña son requeridos"
}
```

---

### Error 2: Contraseña Muy Corta (Sign In)

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "usuario",
    "contrasenna": "123"
  }'
```

**Response (400 Bad Request):**
```json
{
  "error": "La contraseña debe tener al menos 6 caracteres"
}
```

---

### Error 3: Usuario Ya Existe (Sign In)

**Request:**
```bash
# Intentar registrar el mismo usuario dos veces
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "juan_perez",
    "contrasenna": "password123"
  }'

# Segunda vez
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "juan_perez",
    "contrasenna": "otro_password"
  }'
```

**Response (409 Conflict):**
```json
{
  "error": "El usuario ya existe"
}
```

---

### Error 4: Credenciales Incorrectas (Login)

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "juan_perez",
    "contrasenna": "PasswordIncorrecto"
  }'
```

**Response (401 Unauthorized):**
```json
{
  "error": "Usuario o contraseña incorrectos"
}
```

---

### Error 5: Usuario No Existe (Login)

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "usuario_inexistente",
    "contrasenna": "password123"
  }'
```

**Response (401 Unauthorized):**
```json
{
  "error": "Usuario o contraseña incorrectos"
}
```

---

### Error 6: Token No Proporcionado (Ruta Protegida)

**Request (sin token):**
```bash
curl -X GET http://localhost:3000/api/juegos
```

**Response (401 Unauthorized):**
```json
{
  "error": "Token no proporcionado"
}
```

---

### Error 7: Token Inválido (Ruta Protegida)

**Request:**
```bash
curl -X GET http://localhost:3000/api/juegos \
  -H "Authorization: Bearer token_invalido_xyz123"
```

**Response (401 Unauthorized):**
```json
{
  "error": "Token inválido"
}
```

---

### Error 8: Token Expirado (Ruta Protegida)

**Response (401 Unauthorized):**
```json
{
  "error": "Token expirado"
}
```

---

## 📱 Ejemplos con JavaScript/Fetch

### Sign In
```javascript
const signin = async () => {
  const response = await fetch('http://localhost:3000/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: 'juan_perez',
      contrasenna: 'MiPassword123'
    })
  });

  const data = await response.json();
  console.log(data);
};
```

### Login
```javascript
const login = async () => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: 'juan_perez',
      contrasenna: 'MiPassword123'
    })
  });

  const data = await response.json();
  localStorage.setItem('token', data.token);
  console.log('Token guardado:', data.token);
};
```

### Usar Token en Ruta Protegida
```javascript
const getProtectedData = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/api/juegos', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  console.log(data);
};
```

---

## 📝 Notas Importantes

1. **Token Duration**: Los tokens expiran en **24 horas**
2. **Seguridad**: La contraseña se encripta con bcryptjs (10 rondas)
3. **Bearer Token**: Siempre envía el token con el prefijo `Bearer `
4. **Nombres únicos**: Los nombres de usuario deben ser únicos
5. **Contraseñas**: Mínimo 6 caracteres recomendado (se valida en el cliente)
6. **Base de Datos**: Los datos se guardan en MongoDB

---

## 🔄 Flujo Completo en una Aplicación

```
1. Usuario abre la app
   ↓
2. Usuario ve pantalla de login/registro
   ↓
3. Usuario se registra (Sign In)
   → POST /api/auth/signin
   ↓
4. Usuario inicia sesión (Login)
   → POST /api/auth/login
   ← Recibe token JWT
   ↓
5. App guarda token en localStorage/AsyncStorage
   ↓
6. Usuario accede a recursos protegidos
   → GET /api/juegos (con token en header)
   ← Recibe datos
   ↓
7. Si token expira, pedir al usuario que inicie sesión nuevamente
```
