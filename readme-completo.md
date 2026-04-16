# 🏥 ECV Sistema — Plataforma de Gestión de Citas Médicas

## 📌 Descripción General

ECV Sistema es una aplicación web desarrollada con el objetivo de facilitar la gestión de citas médicas, permitiendo la interacción entre pacientes, doctores y administradores dentro de un entorno centralizado.

El sistema permite:

* Registro y autenticación de usuarios
* Gestión de doctores y hospitales
* Asignación de citas médicas
* Notificaciones automáticas por correo
* Participación en un foro de discusión
* Evaluación de síntomas (autoevaluación)

Este proyecto fue desarrollado como parte de una tesis, con un enfoque práctico en la digitalización de procesos médicos y mejora en la comunicación entre pacientes y profesionales de la salud.

---

## 🎯 Objetivos del Sistema

### Objetivo General

Desarrollar una plataforma web que permita gestionar citas médicas de forma eficiente, incorporando funcionalidades modernas como geolocalización, control de roles y notificaciones automáticas.

### Objetivos Específicos

* Permitir a los usuarios registrarse y solicitar citas médicas
* Facilitar a los doctores la gestión de sus pacientes y citas
* Brindar a los administradores control total sobre el sistema
* Implementar notificaciones automáticas para mejorar la comunicación
* Centralizar la información médica en una sola plataforma

---

## 🧠 Arquitectura del Sistema

El sistema está dividido en dos partes principales:

### 🔹 Backend (API REST)

* Framework: Laravel
* Autenticación: Laravel Sanctum
* Base de datos: MySQL
* Notificaciones: Laravel Notifications (Email SMTP)

### 🔹 Frontend

* Framework: React
* Bundler: Vite
* Estilos: TailwindCSS
* Consumo de API: Axios

---

## 👥 Roles del Sistema

El sistema maneja tres tipos de usuarios:

| Rol             | Descripción                            |
| --------------- | -------------------------------------- |
| **Admin (1)**   | Control total del sistema              |
| **Doctor (2)**  | Gestiona citas y su perfil profesional |
| **Usuario (3)** | Solicita citas médicas                 |

---

## 🔐 Autenticación y Seguridad

* Autenticación basada en tokens mediante **Laravel Sanctum**
* Middleware personalizado para control de roles
* Protección de rutas en frontend y backend
* Validaciones en cada endpoint

---

## 🧩 Módulos del Sistema

### 👤 Módulo de Usuarios

* CRUD completo (solo admin)
* Gestión de roles
* Campo adicional: teléfono
* Protección contra auto eliminación

---

### 🩺 Módulo de Doctores

* Asociados a:

    * Usuario
    * Ciudad
    * Hospital
* Información adicional:

    * Especialidad
    * Teléfono
    * Horario de atención

---

### 🏥 Módulo de Hospitales

* Registro de hospitales con:

    * Dirección
    * Coordenadas (lat/lng)
    * Ciudad
* Visualización en mapa
* Integración con Google Maps

---

### 🌎 Módulo de Ciudades

* Seeder con ciudades de Paraguay
* Relación con hospitales y doctores
* Filtros en frontend

---

### 📅 Módulo de Citas

* Creación de citas por usuarios
* Estados:

    * Pendiente
    * Confirmada
    * Cancelada
    * Completada
* Validaciones:

    * No duplicar citas
    * Horario dentro del rango del doctor

---

### 🔔 Notificaciones por Correo

Al crear una cita:

* Se envía automáticamente un email al doctor
* Incluye:

    * Fecha y hora
    * Datos del paciente
    * Teléfono del paciente
    * Hospital y ciudad

Implementado mediante:

* Laravel Notifications
* SMTP (Gmail)

---

### 💬 Módulo de Foro

* Creación de publicaciones
* Comentarios
* Edición y eliminación con validación de autoría

---

### 🧪 Módulo de Autoevaluación

* Evaluación básica de síntomas
* Enfoque orientativo (no diagnóstico médico)

---

## ⚙️ Configuración del Proyecto

---

### 🔹 Backend (Laravel)

#### Instalación

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

---

### 🔹 Variables de entorno importantes

```env
APP_NAME=ECV Sistema
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost
```

---

## 📧 Configuración de Email (Gmail SMTP)

Para envío de notificaciones reales:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tu_correo@gmail.com
MAIL_FROM_NAME="ECV Sistema"
```

### Requisitos:

* Activar verificación en dos pasos en Gmail
* Generar contraseña de aplicación

---

### 🔹 Frontend (React)

#### Instalación

```bash
npm install
npm run dev
```

---

## 🌐 Flujo del Sistema

1. Usuario se registra
2. Admin crea doctores o asigna roles
3. Usuario selecciona doctor disponible
4. Sistema valida horario
5. Se registra la cita
6. Doctor recibe notificación por correo
7. Doctor gestiona la cita

---

## 🧪 Pruebas del Sistema

Se realizaron pruebas para:

* Validación de roles
* CRUD de cada módulo
* Flujo de citas
* Envío de correos
* Integración frontend-backend

---

## 🚀 Posibles Mejoras Futuras

* Notificaciones por WhatsApp
* Recordatorios automáticos de citas
* Subida de archivos médicos
* Historial clínico
* Dashboard con estadísticas
* Deploy completo en producción

---

## 🧱 Tecnologías Utilizadas

* Laravel
* React
* Vite
* TailwindCSS
* MySQL
* Axios
* Sanctum

---

## 📌 Conclusión

El sistema desarrollado cumple con los objetivos planteados, proporcionando una solución funcional para la gestión de citas médicas, integrando múltiples módulos y tecnologías modernas.

Se logró:

* Automatizar procesos
* Mejorar la comunicación entre usuarios y doctores
* Centralizar información relevante
* Implementar buenas prácticas de desarrollo

---

## 👨‍💻 Autor

Proyecto desarrollado por:

**Ulises Salinas**

Como parte de su trabajo de tesis.

---
