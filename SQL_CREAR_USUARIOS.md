# 🗄️ Script SQL - Creación de Usuarios para Login

Este archivo contiene los scripts SQL necesarios para crear usuarios en la base de datos después de que los clientes se registren.

---

## 📋 PASO 1: Ver usuarios existentes

```sql
SELECT * FROM user;
```

---

## 📋 PASO 2: Generar hashes BCrypt

**Usar:** https://bcrypt-generator.com/

**Ejemplo de contraseñas:**

| Usuario | Contraseña | Hash BCrypt (Costo 10) |
|---------|-----------|------------------------|
| jose_medina | password123 | $2a$10$slYQmyNdGzin7olVN3p5be8DlH.PKZbv5H8KnzzVgXXbVxzy1A1dm |
| juan_perez | hotel2025 | $2a$10$0WS3LvA3L1/cJKwHdKxNPOtXNs3JG2H2Fq0L5K.M8N9P0Q1R2S3T |
| admin | admin123 | $2a$10$VscDe/0H3K2L1M9N8O7P6Q5R4S3T2U1VWXYZabcdefghijklmnop |

---

## 📋 PASO 3: Insertar usuarios en tabla 'user'

### **Ejemplo 1: Insertar usuario "jose_medina"**

```sql
INSERT INTO user (username, password, enabled) 
VALUES (
    'jose_medina',
    '$2a$10$slYQmyNdGzin7olVN3p5be8DlH.PKZbv5H8KnzzVgXXbVxzy1A1dm',
    1
);
```

### **Ejemplo 2: Insertar usuario "juan_perez"**

```sql
INSERT INTO user (username, password, enabled) 
VALUES (
    'juan_perez',
    '$2a$10$0WS3LvA3L1/cJKwHdKxNPOtXNs3JG2H2Fq0L5K.M8N9P0Q1R2S3T',
    1
);
```

### **Ejemplo 3: Insertar usuario administrador**

```sql
INSERT INTO user (username, password, enabled) 
VALUES (
    'admin',
    '$2a$10$VscDe/0H3K2L1M9N8O7P6Q5R4S3T2U1VWXYZabcdefghijklmnop',
    1
);
```

---

## 📋 PASO 4: Asignar roles (si es necesario)

Si tu sistema usa roles, inserta también en la tabla de relación:

```sql
-- Asumir que roles ya existen:
-- id_role = 1 → USER
-- id_role = 2 → ADMIN

-- Asignar rol USER a jose_medina
INSERT INTO user_roles (user_id, role_id) 
VALUES ((SELECT id_user FROM user WHERE username = 'jose_medina'), 1);

-- Asignar rol ADMIN a admin
INSERT INTO user_roles (user_id, role_id) 
VALUES ((SELECT id_user FROM user WHERE username = 'admin'), 2);
```

---

## 📋 PASO 5: Verificar que se crearon correctamente

```sql
-- Ver todos los usuarios
SELECT u.id_user, u.username, u.enabled, r.role_name 
FROM user u
LEFT JOIN user_roles ur ON u.id_user = ur.user_id
LEFT JOIN role r ON ur.role_id = r.id_role
ORDER BY u.id_user;
```

---

## 🧪 Pruebas de Login

Después de insertar el usuario, prueba el login:

### **Con curl:**
```bash
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"username":"jose_medina","password":"password123"}'
```

### **Respuesta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **En la interfaz:**
1. Ir a `http://localhost:4200/login`
2. Ingresar:
   - Usuario: `jose_medina`
   - Contraseña: `password123`
3. Click en "Iniciar Sesión"
4. Debe redirigir a `/home`

---

## ⚠️ IMPORTANTE

- **NO guardes contraseñas en texto plano** ❌
- **SIEMPRE usa BCrypt** con costo 10 o superior ✅
- **Verifica que `enabled = true`** para que pueda iniciar sesión ✅
- **El hash BCrypt debe tener exactamente 60 caracteres** (incluyendo el prefijo $2a$10$)

---

## 🔄 Actualizar contraseña existente

Si necesitas cambiar la contraseña de un usuario:

```sql
UPDATE user 
SET password = '$2a$10$NUEVO_HASH_AQUI' 
WHERE username = 'jose_medina';
```

---

## 🗑️ Eliminar usuario (si es necesario)

```sql
-- Primero elimina roles asociados
DELETE FROM user_roles WHERE user_id = (SELECT id_user FROM user WHERE username = 'jose_medina');

-- Luego elimina el usuario
DELETE FROM user WHERE username = 'jose_medina';
```

---

## 📌 Checklist

- [ ] He generado hashes BCrypt para cada contraseña
- [ ] He insertado usuarios en tabla `user`
- [ ] He asignado roles si es necesario
- [ ] He verificado con SELECT que los usuarios existen
- [ ] He probado login en la interfaz web
- [ ] El token JWT se genera correctamente
- [ ] Puedo acceder a las páginas protegidas

---

**Última actualización:** 2 de Diciembre 2025
