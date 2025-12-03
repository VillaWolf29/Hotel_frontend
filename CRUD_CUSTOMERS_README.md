# CRUD de Clientes - Hotel Frontend

## 📋 Descripción

Se ha implementado un CRUD completo para la gestión de **Clientes** en el sistema de hotel, respetando todos los atributos del modelo `Customer` y utilizando el servicio `CustomerService` existente.

## 🏗️ Estructura de Archivos

```
src/app/
├── model/
│   └── customer.ts                                    # Modelo de datos
├── services/
│   └── customer-service.ts                            # Servicio para operaciones CRUD
└── pages/
    └── customer-component/
        ├── customer-component.ts                      # Componente principal (listado)
        ├── customer-component.html                    # Template del listado
        ├── customer-component.css                     # Estilos del listado
        └── customer-edit-component/
            ├── customer-edit-component.ts             # Componente de edición/creación
            ├── customer-edit-component.html           # Template del formulario
            └── customer-edit-component.css            # Estilos del formulario
```

## 📊 Modelo Customer

El modelo incluye los siguientes atributos:

```typescript
export class Customer {
    idCustomer: number;      // ID único del cliente
    firstName: string;       // Nombre
    lastName: string;        // Apellido
    email: string;          // Correo electrónico
    phone: string;          // Teléfono
    idCard: string;         // DNI/Documento de identidad
    address: string;        // Dirección
}
```

## 🔧 Funcionalidades Implementadas

### 1. **Listado de Clientes** (`customer-component.ts`)

- ✅ Tabla con paginación y ordenamiento
- ✅ Búsqueda en tiempo real (filtra por nombre, email, teléfono, etc.)
- ✅ Visualización de todos los atributos del cliente
- ✅ Botones de acción: Editar y Eliminar
- ✅ Botón para crear nuevo cliente

### 2. **Crear Cliente** (`customer-edit-component.ts`)

- ✅ Formulario reactivo con validaciones
- ✅ Campos para todos los atributos:
  - Nombre (mínimo 2 caracteres)
  - Apellido (mínimo 2 caracteres)
  - Email (validación de formato)
  - Teléfono (solo números, 9-15 dígitos)
  - DNI/Documento (mínimo 8 caracteres)
  - Dirección (mínimo 5 caracteres)
- ✅ Mensajes de error descriptivos
- ✅ Iconos en cada campo para mejor UX

### 3. **Editar Cliente**

- ✅ Mismo formulario que crear, pre-cargado con datos existentes
- ✅ Actualización mediante el servicio `update()`
- ✅ Validaciones en tiempo real

### 4. **Eliminar Cliente**

- ✅ Confirmación antes de eliminar
- ✅ Actualización automática de la tabla
- ✅ Notificación de éxito

## 🎨 Componentes de Angular Material Utilizados

- `MatTableModule` - Tabla de datos
- `MatPaginatorModule` - Paginación
- `MatSortModule` - Ordenamiento de columnas
- `MatFormFieldModule` - Campos de formulario
- `MatInputModule` - Inputs de texto
- `MatButtonModule` - Botones
- `MatIconModule` - Iconos
- `MatDialogModule` - Diálogos modales
- `MatSnackBarModule` - Notificaciones
- `MatTooltipModule` - Tooltips informativos
- `MatToolbarModule` - Barra de herramientas

## 🔄 Servicio CustomerService

El servicio utiliza los métodos heredados de `GenericService`:

```typescript
- findAll()               // Obtener todos los clientes
- findById(id)            // Obtener un cliente por ID
- save(customer)          // Crear un nuevo cliente
- update(id, customer)    // Actualizar un cliente existente
- delete(id)              // Eliminar un cliente
```

Además incluye Subjects para comunicación reactiva:
- `customerChange` - Observable para cambios en la lista
- `messageChange` - Observable para notificaciones

## 🚀 Cómo Usar

### Navegar al módulo de clientes:
```
http://localhost:4200/customers
```

### Crear un nuevo cliente:
1. Clic en el botón "Nuevo Cliente"
2. Completar el formulario
3. Clic en "Guardar"

### Editar un cliente:
1. Clic en el ícono de edición (✏️) en la fila del cliente
2. Modificar los datos necesarios
3. Clic en "Actualizar"

### Eliminar un cliente:
1. Clic en el ícono de eliminación (🗑️) en la fila del cliente
2. Confirmar la acción

### Buscar clientes:
1. Usar el campo de búsqueda en la parte superior de la tabla
2. La búsqueda filtra en tiempo real por cualquier campo

## ✅ Validaciones Implementadas

| Campo | Validaciones |
|-------|-------------|
| Nombre | Requerido, mínimo 2 caracteres |
| Apellido | Requerido, mínimo 2 caracteres |
| Email | Requerido, formato válido de email |
| Teléfono | Requerido, solo números (9-15 dígitos) |
| DNI/Doc | Requerido, mínimo 8 caracteres |
| Dirección | Requerido, mínimo 5 caracteres |

## 🎯 Características Adicionales

- **Responsive Design**: La interfaz se adapta a diferentes tamaños de pantalla
- **Feedback Visual**: Notificaciones (snackbar) para todas las operaciones
- **Estados del Formulario**: Los botones se deshabilitan si el formulario es inválido
- **Experiencia de Usuario**: Iconos, tooltips y mensajes claros
- **Código Limpio**: Uso de standalone components y buenas prácticas de Angular

## 🔗 Integración con Backend

El servicio está configurado para conectarse al endpoint:
```typescript
${environment.HOST}/customers
```

Asegúrate de que tu backend tenga implementados los siguientes endpoints:
- `GET /customers` - Listar todos
- `GET /customers/{id}` - Obtener uno por ID
- `POST /customers` - Crear nuevo
- `PUT /customers/{id}` - Actualizar
- `DELETE /customers/{id}` - Eliminar

## 📝 Notas

- El componente usa `standalone: true` (sin módulos tradicionales)
- Se utiliza programación reactiva con RxJS (Observables y Subjects)
- El formulario es reactivo (`ReactiveFormsModule`)
- Se implementó el patrón de comunicación entre componentes mediante Subjects
