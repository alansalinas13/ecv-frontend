# 🏥 ECV Sistema — Plataforma Web de Gestión Médica con IA

## 📌 Descripción General

ECV Sistema es una plataforma web desarrollada para la gestión de usuarios, doctores, hospitales y citas médicas, incorporando además funciones de interacción social, autoevaluación de riesgo y asistencia orientativa mediante inteligencia artificial.

El sistema fue concebido como una solución integral para facilitar la relación entre pacientes, doctores y administradores, centralizando la información relevante en un solo entorno digital.

---

# 🎯 Objetivo del Proyecto

Desarrollar una aplicación web moderna, escalable y funcional que permita:

* registrar y autenticar usuarios
* administrar roles
* gestionar doctores, hospitales y ciudades
* agendar citas médicas
* notificar automáticamente a doctores
* ofrecer un foro de interacción
* realizar autoevaluaciones orientativas
* incorporar un asistente de IA local como apoyo informativo

---

# 🧠 Arquitectura del Sistema

El proyecto está dividido en dos capas desacopladas:

## Backend

* Laravel
* API REST
* PostgreSQL
* Laravel Sanctum
* Laravel Notifications
* Integración IA local con Ollama

## Frontend

* React
* Vite
* TailwindCSS
* Axios

---

# 👥 Roles del Sistema

El sistema maneja tres tipos de usuarios:

| Rol     | Código | Descripción                                                               |
| ------- | ------ | ------------------------------------------------------------------------- |
| Admin   | 1      | Gestiona usuarios, doctores, hospitales, ciudades y configuración general |
| Doctor  | 2      | Gestiona su perfil y administra citas                                     |
| Usuario | 3      | Solicita citas, participa en el foro y utiliza la autoevaluación          |

---

# 🔐 Seguridad y Control de Acceso

Se implementaron varias capas de seguridad:

* autenticación por token con Laravel Sanctum
* middleware `auth:sanctum`
* middleware por rol
* validaciones en backend
* protección visual de acciones en frontend
* control de autoría en foro
* prevención de autoeliminación de administradores

---

# ⚙️ Tecnologías Utilizadas

## Backend

* Laravel
* PostgreSQL
* Sanctum
* Notifications
* SMTP Gmail
* Ollama

## Frontend

* React
* Vite
* TailwindCSS
* Axios
* React Leaflet

---

# 🧩 Módulos del Sistema

## 1. Módulo de Usuarios

Acceso exclusivo para administradores.

### Funcionalidades

* listar usuarios
* crear usuarios
* editar usuarios
* eliminar usuarios
* asignar roles
* registrar teléfono

### Reglas

* solo admin accede al módulo
* un admin no puede eliminarse a sí mismo

---

## 2. Módulo de Ciudades

Permite estructurar hospitales y doctores por ubicación.

### Funcionalidades

* tabla `cities`
* seeder inicial con ciudades de Paraguay
* CRUD administrativo
* filtro por ciudad en otros módulos

---

## 3. Módulo de Hospitales

Cada hospital puede asociarse a una ciudad.

### Funcionalidades

* crear hospital
* editar hospital
* eliminar hospital
* visualizar hospital en mapa
* copiar dirección
* abrir en Google Maps
* filtrar por ciudad
* ordenar por nombre, dirección o ciudad

### Datos manejados

* ciudad
* nombre
* dirección
* latitud
* longitud

---

## 4. Módulo de Doctores

Cada doctor está asociado a:

* un usuario con rol doctor
* una ciudad
* un hospital
* un horario de atención

### Funcionalidades

* CRUD por admin
* edición propia por doctor
* filtros por ciudad
* búsqueda por nombre, especialidad, ciudad o hospital

### Datos manejados

* especialidad
* teléfono
* descripción
* ciudad
* hospital
* hora inicio
* hora fin

---

## 5. Módulo de Citas

Permite gestionar el flujo completo de citas médicas.

### Funcionalidades

* usuario crea cita
* doctor actualiza estado
* admin visualiza
* filtro por estado
* contexto completo del doctor en la cita

### Estados

* pending
* confirmed
* cancelled
* completed

### Validaciones

* no se permite crear citas fuera del horario del doctor
* no se permite duplicar cita exacta con el mismo doctor y fecha

### Información visible en la cita

* doctor
* especialidad
* ciudad
* hospital
* horario de atención
* datos del paciente

---

## 6. Módulo de Notificaciones por Correo

Cuando un usuario registra una cita, el sistema envía automáticamente un email al doctor.

### Contenido del correo

* fecha y hora de la cita
* nombre del paciente
* correo del paciente
* teléfono del paciente
* hospital
* ciudad

### Implementación

* Laravel Notifications
* SMTP Gmail
* contraseña de aplicación

---

## 7. Módulo de Foro

Permite la interacción entre usuarios.

### Funcionalidades

* crear publicaciones
* editar publicaciones propias
* eliminar publicaciones propias
* comentar
* eliminar comentarios propios
* buscar publicaciones por título

### Seguridad

* control de autoría en backend
* control visual en frontend

---

## 8. Módulo de Autoevaluación

Permite registrar una autoevaluación cardiovascular orientativa.

### Funcionalidades

* formulario de autoevaluación
* cálculo de score
* clasificación de riesgo
* historial de evaluaciones

---

## 9. IA aplicada a Autoevaluación

Se agregó una capa de inteligencia artificial local para generar un resumen orientativo del resultado de cada autoevaluación.

### Objetivo

Explicar en lenguaje claro:

* el nivel de riesgo
* los factores detectados
* recomendaciones generales

### Importante

La IA:

* no diagnostica
* no reemplaza consulta médica
* solo complementa la lógica del sistema

---

## 10. Asistente ECV

Módulo conversacional orientativo basado en IA local.

### Funcionalidades

* responder preguntas generales sobre salud cardiovascular
* dar orientación preventiva
* advertir cuando se requiere atención médica
* aclarar que no reemplaza consulta profesional

### Implementación

* backend Laravel
* servicio `AiService`
* integración local con Ollama
* modelo configurable por `.env`

---

# 🧠 Integración de IA

La integración de IA se implementó de forma desacoplada para permitir dos escenarios:

## Desarrollo / tesis

* ejecución local con Ollama
* sin costos de API
* mayor privacidad

## Escalabilidad futura

* posibilidad de cambiar la URL/base del proveedor IA
* migración a servidor externo o API remota sin reescribir frontend

---

# 📂 Estructura General del Proyecto

## Backend

* controladores API
* modelos
* migraciones
* seeders
* servicios
* notificaciones
* configuración IA
* rutas protegidas

## Frontend

* páginas por módulo
* componentes reutilizables
* context de autenticación
* rutas protegidas
* formularios y filtros
* integración con mapa

---

# ⚙️ Instalación del Backend

## 1. Instalar dependencias

```bash
composer install
```

## 2. Configurar entorno

```bash
cp .env.example .env
```

## 3. Generar clave

```bash
php artisan key:generate
```

## 4. Configurar base de datos PostgreSQL en `.env`

Ejemplo:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ecv_db
DB_USERNAME=postgres
DB_PASSWORD=tu_password
```

## 5. Ejecutar migraciones y seeders

```bash
php artisan migrate --seed
```

## 6. Levantar backend

```bash
php artisan serve
```

---

# ⚙️ Instalación del Frontend

## 1. Instalar dependencias

```bash
npm install
```

## 2. Configurar `.env`

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## 3. Ejecutar entorno de desarrollo

```bash
npm run dev
```

## 4. Generar build de producción

```bash
npm run build
```

---

# 📧 Configuración de Correo

Para notificaciones reales con Gmail SMTP:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_contraseña_de_aplicacion
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tu_correo@gmail.com
MAIL_FROM_NAME="ECV Sistema"
```

### Requisitos

* verificación en dos pasos activada
* contraseña de aplicación generada en Google

---

# 🤖 Configuración de IA Local

Variables en `.env` del backend:

```env
AI_PROVIDER=ollama
AI_BASE_URL=http://127.0.0.1:11434
AI_MODEL=llama3.2
AI_TIMEOUT=120
```

### Requisitos

* instalar Ollama en el sistema operativo
* descargar el modelo:

```bash
ollama pull llama3.2
```

---

# 🌐 Flujo General del Sistema

1. El usuario se registra o es creado por un administrador
2. El admin puede asignar roles
3. El admin crea doctores sobre usuarios con rol doctor
4. Se definen ciudad, hospital y horario del doctor
5. El usuario crea una cita dentro del rango horario permitido
6. El doctor recibe una notificación por correo
7. El doctor gestiona el estado de la cita
8. El usuario puede usar foro, autoevaluación y asistente ECV

---

# 🧪 Pruebas Funcionales Realizadas

Se validó:

* autenticación
* persistencia de sesión
* menú por rol
* CRUD de usuarios
* CRUD de doctores
* CRUD de hospitales
* ciudades con seeder
* citas con validación de horario
* envío de correos
* foro con control de autoría
* autoevaluación con resumen IA
* asistente ECV con Ollama
* build de frontend

---

# 🚀 Mejoras Futuras Posibles

* disponibilidad avanzada por franjas horarias
* recordatorios automáticos de citas
* notificaciones por WhatsApp
* historial clínico
* panel estadístico
* despliegue completo con IA remota
* paginación avanzada
* auditoría de acciones administrativas

---

# 📌 Conclusión

El sistema desarrollado cumple con los objetivos planteados, integrando módulos administrativos, médicos y de interacción, junto con notificaciones y una primera capa de inteligencia artificial orientativa.

Se logró:

* centralizar la gestión del sistema
* eliminar dependencia de cambios manuales en base de datos
* mejorar la experiencia del usuario
* implementar una arquitectura moderna, escalable y desacoplada
* incorporar IA local sin costos adicionales

El proyecto queda preparado tanto para presentación académica como para evolución futura hacia un entorno productivo más robusto.

---

# 👨‍💻 Autor

**Alan Ulises Salinas**

Proyecto desarrollado como parte de tesis.
