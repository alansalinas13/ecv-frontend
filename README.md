# ? ECV Sistema ? Frontend

Aplicación frontend desarrollada en React para la plataforma de información, interacción y gestión médica enfocada en enfermedades cardiovasculares.

---

# ? Tecnologías utilizadas

* React (última versión estable)
* Vite
* Axios
* TailwindCSS
* React Router DOM
* Leaflet + React Leaflet

---

# ?? Instalación

## 1. Clonar repositorio

```bash
git clone <repo-url>
cd ecv-frontend
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Configurar variables de entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 4. Ejecutar el proyecto

```bash
npm run dev
```

El proyecto estará disponible en:

```text
http://localhost:5173
```

---

# ? Estructura del proyecto

```text
src/
?
??? api/
?   ??? axios.js
?
??? components/
?   ??? auth/
?   ??? layout/
?   ??? doctors/
?   ??? appointments/
?   ??? forum/
?   ??? hospitals/
?   ??? evaluations/
?
??? context/
?   ??? AuthContext.jsx
?
??? pages/
?   ??? Home.jsx
?   ??? Login.jsx
?   ??? Register.jsx
?   ??? Dashboard.jsx
?   ??? Doctors.jsx
?   ??? Appointments.jsx
?   ??? Forum.jsx
?   ??? ForumDetail.jsx
?   ??? Evaluation.jsx
?   ??? HospitalsMap.jsx
?
??? router/
?   ??? AppRouter.jsx
?
??? utils/
?   ??? leaflet.js
?
??? main.jsx
```

---

# ? Autenticación

## Flujo

1. Usuario se registra o loguea
2. Backend devuelve token (Laravel Sanctum)
3. Token se guarda en `localStorage`
4. Axios lo envía automáticamente en cada request

---

## Axios

Archivo:

```text
src/api/axios.js
```

Configuración:

* baseURL desde `.env`
* headers JSON
* interceptor con Bearer Token

---

## AuthContext

Responsable de:

* manejar usuario autenticado
* guardar token
* recuperar sesión con `/auth/me`
* logout

---

## Protección de rutas

* `ProtectedRoute` ? requiere login
* `GuestRoute` ? bloquea acceso si ya está logueado

---

# ???? Módulos implementados

---

## ? Dashboard

* muestra información del usuario autenticado
* nombre, email y rol

---

## ???? Doctores

### Funcionalidades

* listado de doctores
* visualización en tarjetas

### Endpoint

```text
GET /api/doctors
```

---

## ? Citas

### Usuario

* crear cita
* ver sus citas

### Doctor

* ver citas asignadas
* cambiar estado

### Estados

* pending
* confirmed
* cancelled

### Endpoints

```text
GET /api/appointments
POST /api/appointments
PUT /api/appointments/{id}/status
```

---

## ? Foro

### Rutas

* `/forum` ? listado
* `/forum/:id` ? detalle

### Funcionalidades

* crear post
* editar/eliminar post propio
* comentar
* eliminar comentario propio

### Endpoints

```text
GET /api/posts
GET /api/posts/{id}
POST /api/posts
PUT /api/posts/{id}
DELETE /api/posts/{id}
POST /api/posts/{id}/comments
DELETE /api/comments/{id}
```

---

## ? Autoevaluación

### Funcionalidades

* formulario de evaluación
* cálculo de riesgo
* historial de evaluaciones

### Endpoints

```text
GET /api/evaluations
POST /api/evaluations
```

---

## ?? Hospitales

### Funcionalidades

* listado de hospitales
* mapa interactivo
* marcadores con ubicación
* copiar dirección
* abrir en Google Maps

### Admin

* crear hospital
* editar hospital
* eliminar hospital

### Endpoints

```text
GET /api/hospitals
POST /api/hospitals
PUT /api/hospitals/{id}
DELETE /api/hospitals/{id}
```

---

# ?? Mapa

## Librerías

```bash
npm install leaflet react-leaflet
```

## Configuración

Archivo:

```text
src/utils/leaflet.js
```

Corrige iconos de marcador en Vite.

---

# ? Control por roles

El frontend ajusta la UI según rol:

| Rol    | Acceso                 |
| ------ | ---------------------- |
| Admin  | gestión de hospitales  |
| Doctor | gestión de citas       |
| User   | crear citas            |
| Todos  | foro, mapa, evaluación |

---

# ?? Manejo de errores

* validaciones backend mostradas en UI
* errores generales capturados
* mensajes de feedback al usuario

---

# ? Scripts disponibles

```bash
npm run dev     # desarrollo
npm run build   # build producción
npm run preview # preview build
```

---

# ? Build de producción

```bash
npm run build
```

Salida:

```text
dist/
```

---

# ? Requisitos

* Node.js LTS (>= 20)
* Backend Laravel corriendo

---

# ? Notas

* El sistema depende del backend Laravel
* Las rutas API usan Sanctum
* El frontend no reemplaza validaciones backend


# Variables de entorno

Crear archivo `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```
---
# Menú por rol

La navegación del sistema se construye dinámicamente según el rol del usuario autenticado.

## Roles

- 1: Admin
- 2: Doctor
- 3: Usuario

## Visibilidad

### Admin
- Dashboard
- Doctores
- Citas
- Foro
- Hospitales

### Doctor
- Dashboard
- Doctores
- Citas
- Foro
- Hospitales

### Usuario
- Dashboard
- Doctores
- Citas
- Foro
- Autoevaluación
- Hospitales

## Protección adicional

Se usa `RoleRoute` para restringir rutas del frontend según rol.

## Mejora UX - Buscador en foro

En la página `/forum` se incorporó un buscador por título.

### Comportamiento

- filtra localmente los posts cargados
- ignora mayúsculas/minúsculas
- muestra mensaje si no hay coincidencias
## Mejora UX - Filtro de citas

En la página `/appointments` se agregó filtrado por estado.

### Estados disponibles

- all
- pending
- confirmed
- cancelled

### Comportamiento

- filtra localmente las citas cargadas
- ordena por fecha ascendente
- muestra mensaje si no hay coincidencias

## Mejora UX - Doctores

En la página `/doctors` se agregaron:

- buscador por nombre o especialidad
- ordenamiento por nombre
- ordenamiento por especialidad

## Mejora UX - Hospitales

En la página `/hospitals` se agregaron:

- buscador por nombre o dirección
- ordenamiento por nombre
- ordenamiento por dirección

El mapa refleja la lista filtrada de hospitales.

## Nuevo estado de citas

Se agregó el estado:

- completed

### Significado

Indica que la consulta ya fue realizada.

### Flujo de estados

- pending
- confirmed
- cancelled
- completed
## Ajuste final - Módulo Doctores

### Admin
- crear doctor
- editar cualquier doctor
- eliminar doctor

### Doctor
- editar su propio perfil

### User
- solo visualizar listado

### Endpoints adicionales

GET /api/doctor-users/available
PUT /api/doctors/{id}
DELETE /api/doctors/{id}
POST /api/doctors