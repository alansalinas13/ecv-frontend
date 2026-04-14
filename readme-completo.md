# 🏥 Plataforma Web de Gestión de Enfermedades Cardiovasculares (ECV)

## 📌 Descripción General

Sistema web completo para la gestión e interacción de usuarios en el ámbito de enfermedades cardiovasculares (ECV).

Permite:

* Registro y autenticación de usuarios
* Gestión de roles (admin, doctor, usuario)
* Gestión de doctores
* Agendamiento y seguimiento de citas médicas
* Foro de interacción entre usuarios
* Autoevaluación de riesgo cardiovascular
* Visualización y gestión de hospitales en mapa

---

# 🧠 Arquitectura del Sistema

El sistema está dividido en dos aplicaciones desacopladas:

## Backend

* Laravel (última versión estable)
* PostgreSQL
* API REST
* Laravel Sanctum (autenticación por tokens)

## Frontend

* React (Vite)
* Axios
* TailwindCSS

---

# ⚙️ Instalación

## 🔹 1. Clonar el proyecto

```bash
git clone <url-del-repo>
cd ecv-sistema
```

---

# 🖥️ BACKEND (Laravel)

## 📦 1. Instalar dependencias

```bash
cd ecv-backend
composer install
```

---

## ⚙️ 2. Configurar entorno

Crear archivo `.env`:

```bash
cp .env.example .env
```

Configurar base de datos PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ecv_db
DB_USERNAME=postgres
DB_PASSWORD=tu_password
```

---

## 🔑 3. Generar clave

```bash
php artisan key:generate
```

---

## 🗄️ 4. Migraciones

```bash
php artisan migrate
```

---

## 🚀 5. Ejecutar servidor

```bash
php artisan serve
```

Backend disponible en:

```text
http://127.0.0.1:8000
```

---

# 🔐 Autenticación

Se utiliza **Laravel Sanctum** con tokens.

### Endpoints:

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/logout`
* `GET /api/auth/me`

---

# 🧑‍⚕️ ROLES

| Rol    | Código |
| ------ | ------ |
| Admin  | 1      |
| Doctor | 2      |
| User   | 3      |

---

# 📡 API PRINCIPAL

## 🧑‍⚕️ Doctores

* `GET /api/doctors`
* `GET /api/doctors/{id}`
* `POST /api/doctors` (admin)
* `PUT /api/doctors/{id}` (admin o dueño)
* `DELETE /api/doctors/{id}` (admin)

### Extra:

* `GET /api/doctor-users/available`

---

## 📅 Citas

* `GET /api/appointments`
* `POST /api/appointments`
* `PUT /api/appointments/{id}/status`

### Estados:

* `pending`
* `confirmed`
* `cancelled`
* `completed` ✅

---

## 💬 Foro

* `GET /api/posts`
* `POST /api/posts`
* `PUT /api/posts/{id}`
* `DELETE /api/posts/{id}`

### Comentarios

* `POST /api/posts/{id}/comments`
* `DELETE /api/comments/{id}`

---

## 🧠 Autoevaluación

* `POST /api/evaluations`
* `GET /api/evaluations`

---

## 🏥 Hospitales

* `GET /api/hospitals`
* `POST /api/hospitals` (admin)
* `PUT /api/hospitals/{id}` (admin)
* `DELETE /api/hospitals/{id}` (admin)

---

# 🌐 FRONTEND (React)

## 📦 1. Instalar dependencias

```bash
cd ecv-frontend
npm install
```

---

## ⚙️ 2. Configurar entorno

Crear `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 🚀 3. Ejecutar en desarrollo

```bash
npm run dev
```

Frontend disponible en:

```text
http://localhost:5173
```

---

## 🏗️ 4. Build de producción

```bash
npm run build
```

---

# 🧩 Módulos del Sistema

## 🔐 Autenticación

* Registro
* Login
* Logout
* Persistencia de sesión

---

## 🧑‍⚕️ Doctores

* Listado
* Búsqueda
* Ordenamiento
* CRUD (admin)
* Edición propia (doctor)

---

## 📅 Citas

* Crear citas (user)
* Gestión de estados (doctor)
* Filtros por estado
* Estado final `completed`

---

## 💬 Foro

* Crear posts
* Ver detalle
* Comentarios
* Edición y eliminación por autor
* Buscador por título

---

## 🧠 Autoevaluación

* Evaluación de riesgo cardiovascular
* Almacenamiento de resultados

---

## 🏥 Hospitales

* Mapa interactivo
* CRUD (admin)
* Búsqueda
* Ordenamiento
* Copiar dirección
* Abrir en Google Maps

---

# 🎨 UX Implementada

* Alertas globales
* Loaders
* Modales de confirmación
* Filtros dinámicos
* Búsquedas en tiempo real
* Control de acceso visual por rol

---

# 🔒 Seguridad

* Autenticación con tokens (Sanctum)
* Middleware `auth:sanctum`
* Middleware de roles
* Validaciones backend
* Control de autoría (foro)
* Protección de endpoints sensibles

---

# 📊 Estado del Proyecto

✅ Backend completo
✅ Frontend completo
✅ CRUDs funcionales
✅ Roles implementados
✅ UX optimizada
✅ Build de producción funcional

---

# 🚀 Tecnologías

## Backend

* Laravel
* PostgreSQL
* Sanctum

## Frontend

* React
* Vite
* Axios
* TailwindCSS

---

# 👨‍💻 Autor

Proyecto desarrollado como sistema completo de gestión médica enfocado en ECV.

---

# 📌 Notas finales

* Sistema preparado para producción
* Arquitectura escalable
* Separación clara backend/frontend
* Código limpio y mantenible
