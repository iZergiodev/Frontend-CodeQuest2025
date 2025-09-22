# 🚀 CodeQuest 2025 - Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.13-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

_Una plataforma de blog moderna y elegante construida con las últimas tecnologías web_ ✨

</div>

---

### ✨ Características Principales

- 🎨 **Diseño Moderno**: Interfaz elegante con modo claro/oscuro
- 📱 **Totalmente Responsivo**: Se ve perfecto en cualquier dispositivo
- 🔐 **Autenticación Segura**: Login con Discord y sistema de roles
- 📝 **Editor Markdown**: Crea contenido rico con facilidad
- 💬 **Sistema de Comentarios**: Interactúa con la comunidad
- 🏷️ **Categorías y Etiquetas**: Organiza tu contenido perfectamente
- ⭐ **Sistema de Likes**: Muestra tu aprecio por el contenido
- 🔔 **Notificaciones en Tiempo Real**: Mantente al día con todo
- 👑 **Sistema de Puntos Stardust**: Gana puntos por tu participación
- 📊 **Panel de Administración**: Gestiona la plataforma fácilmente

---

## 🛠️ Tecnologías Utilizadas

### Frontend Core

- **React 19** - La biblioteca de UI más popular
- **TypeScript** - JavaScript con superpoderes
- **Vite** - Herramienta de construcción ultrarrápida
- **React Router v7** - Navegación moderna

### UI y Estilos

- **Tailwind CSS 4** - Framework de CSS utilitario
- **shadcn/ui** - Componentes de UI hermosos y accesibles
- **Radix UI** - Componentes primitivos accesibles
- **Framer Motion** - Animaciones fluidas
- **Lucide React** - Iconos modernos

### Estado y Datos

- **TanStack Query** - Gestión de estado del servidor
- **React Hook Form** - Formularios eficientes
- **Zod** - Validación de esquemas

### Herramientas de Desarrollo

- **Biome** - Linter y formateador ultrarrápido
- **PostCSS** - Procesamiento de CSS
- **SVGR** - Importación de SVGs como componentes

---

## 🚀 Instalación y Configuración

### Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn** o **bun**

### Pasos de Instalación

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/CodeQuest2025.git
   cd CodeQuest2025/Frontend-CodeQuest2025
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   # o
   yarn install
   # o
   bun install
   ```

3. **Configura las variables de entorno**

   ```bash
   cp .env.example .env.local
   ```

   Edita `.env.local` con tus configuraciones:

   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. **Inicia el servidor de desarrollo**

   ```bash
   npm run dev
   # o
   yarn dev
   # o
   bun dev
   ```

5. **¡Abre tu navegador!** 🌐
   Visita `http://localhost:8080` y disfruta de la aplicación

---

## 📁 Estructura del Proyecto

```
src/
├── 📁 components/          # Componentes reutilizables
│   ├── 📁 admin/          # Componentes de administración
│   ├── 📁 comments/       # Componentes de comentarios
│   └── 📁 ui/             # Componentes de UI base (shadcn/ui)
├── 📁 hooks/              # Hooks personalizados de React
├── 📁 lib/                # Utilidades y configuraciones
├── 📁 pages/              # Páginas de la aplicación
├── 📁 router/             # Configuración de rutas
├── 📁 services/           # Servicios de API
├── 📁 types/              # Definiciones de TypeScript
└── 📁 assets/             # Recursos estáticos
```

### 🎯 Componentes Principales

- **`App.tsx`** - Componente raíz con todos los providers
- **`Layout.tsx`** - Layout principal de la aplicación
- **`Header.tsx`** - Barra de navegación superior
- **`Sidebar.tsx`** - Barra lateral de navegación
- **`PostCard.tsx`** - Tarjeta de publicación
- **`CommentBox.tsx`** - Editor de comentarios

### 🔧 Hooks Personalizados

- **`useAuth.tsx`** - Gestión de autenticación
- **`useBlogData.ts`** - Datos del blog
- **`useNotifications.ts`** - Sistema de notificaciones
- **`usePagination.ts`** - Paginación
- **`useImageUpload.ts`** - Subida de imágenes

---

## 🎨 Características de la UI

### 🌓 Modo Oscuro/Claro

La aplicación incluye un sistema de temas completo que se adapta automáticamente a las preferencias del usuario.

### 📱 Diseño Responsivo

- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**: Adaptación perfecta a tablets y desktop
- **Touch Friendly**: Interacciones táctiles optimizadas

### 🎭 Animaciones

- **Framer Motion**: Transiciones suaves y naturales
- **Loading States**: Estados de carga elegantes
- **Hover Effects**: Efectos interactivos sutiles

---

## 🔐 Sistema de Autenticación

### Métodos de Login

- **Discord OAuth**: Login rápido y seguro
- **Email/Password**: Autenticación tradicional
- **Registro**: Creación de cuentas nuevas

### Roles de Usuario

- **👤 Usuario**: Acceso básico a la plataforma
- **👑 Admin**: Panel de administración completo

---

## 📝 Sistema de Publicaciones

### Editor Markdown

- **Editor Visual**: Interfaz amigable para escribir
- **Preview en Tiempo Real**: Ve tu contenido mientras escribes
- **Soporte de Imágenes**: Subida directa a Cloudinary
- **Sintaxis Markdown**: Formateo avanzado de texto

### Organización de Contenido

- **Categorías**: Organización principal del contenido
- **Subcategorías**: Clasificación más específica
- **Etiquetas**: Sistema de etiquetado flexible
- **Búsqueda**: Encuentra contenido rápidamente

---

## 💬 Sistema de Comentarios

- **Comentarios Anidados**: Respuestas a comentarios
- **Likes en Comentarios**: Sistema de votación
- **Notificaciones**: Avisos de nuevas respuestas

---

## 🏆 Sistema de Gamificación

### StarDust Points

- **Puntos por Publicar**: Gana puntos por crear contenido
- **Puntos por Interactuar**: Likes, comentarios, etc.

---

## 🛡️ Panel de Administración

### Gestión de Contenido

- **Publicaciones**: Moderar y gestionar posts
- **Categorías**: Crear y editar categorías
- **Usuarios**: Gestión de usuarios y roles

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye para producción
npm run build:dev    # Construye en modo desarrollo
npm run preview      # Vista previa de la build

# Linting
npm run lint         # Verifica el código
npm run lint:fix     # Corrige automáticamente
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno

```env
# API
VITE_BACKEND_URL=http://localhost:5000
```

### Configuración de Vite

El proyecto usa Vite con configuraciones optimizadas:

- **Hot Module Replacement**: Recarga instantánea
- **Path Aliases**: Importaciones limpias con `@/`
- **SVG Support**: Importación de SVGs como componentes
- **TypeScript**: Soporte completo de TypeScript

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

---

<div align="center">

**¡Construido con ❤️ y mucho ☕ por el equipo Mate entre Líneas!**

_"El código es poesía, y cada línea cuenta una historia"_ ✨

</div>
