# Tattoo AI SuperApp

Una aplicación web moderna para previsualizar tatuajes usando inteligencia artificial. Permite a los usuarios subir fotos de su cuerpo y diseños de tatuajes para ver cómo se verían antes de hacérselos.

## 🚀 Características

- **Previsualización de Tatuajes**: Utiliza IA para mostrar cómo se vería un diseño de tatuaje en la piel del usuario
- **Autenticación Completa**: Sistema de login y registro con NextAuth.js
- **Tipos de Usuario**: Soporte para usuarios normales y tatuadores
- **Editor de Zona**: Herramienta para marcar exactamente dónde se colocará el tatuaje
- **Modo Oscuro**: Interfaz adaptable con soporte para tema claro y oscuro
- **Responsive Design**: Optimizada para dispositivos móviles y desktop
- **Contenedorización**: Lista para deployment con Docker

## 🛠️ Tecnologías

- **Frontend**: Next.js 15.5.4 con React 19.1.0
- **Autenticación**: NextAuth.js v5.0.0-beta.29
- **Estilos**: TailwindCSS 4.0
- **UI/UX**: Lucide React para iconos
- **HTTP Client**: Axios
- **Lenguaje**: TypeScript
- **Contenedores**: Docker

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/auth/           # Endpoints de autenticación
│   ├── login/              # Página de login/registro
│   ├── overview/           # Panel principal de la aplicación
│   ├── layout.tsx          # Layout principal con providers
│   └── page.tsx            # Página de inicio
├── components/
│   ├── navbar/             # Barra de navegación
│   └── preview/            # Componentes de previsualización
├── context/
│   ├── DarkModeContext.tsx # Contexto para modo oscuro
│   └── SessionProvider.tsx # Proveedor de sesiones
├── hooks/
│   └── UsePreviewTattoo.ts # Hook para funcionalidad de preview
├── types/
│   └── auth.ts            # Tipos de TypeScript
├── auth.ts                # Configuración de NextAuth
└── middleware.ts          # Middleware de autenticación
```

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd tattoo-ai-superapp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env.local` con las siguientes variables:
   ```env
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_URL_GATEWAY=https://your-api-gateway-url
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🐳 Docker

### Construir la imagen
```bash
docker build -t tattoo-ai-superapp .
```

### Ejecutar el contenedor
```bash
docker run -p 3001:3001 tattoo-ai-superapp
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta ESLint para verificar el código

## 🎯 Características Principales

### Sistema de Autenticación
- Login y registro de usuarios
- Autenticación basada en credenciales
- Soporte para dos tipos de usuario: Cliente y Tatuador
- Redirección automática después del login

### Previsualización de Tatuajes
- Carga de imagen del cuerpo
- Carga de diseño del tatuaje
- Editor de zona para marcar área específica
- Generación de previsualización con IA
- Descarga del resultado

### Interfaz de Usuario
- Diseño moderno y responsive
- Modo oscuro/claro
- Animaciones suaves
- Iconografía con Lucide React

## 🔒 Autenticación

La aplicación utiliza NextAuth.js para manejar la autenticación. Los usuarios pueden:
- Registrarse como Cliente o Tatuador
- Iniciar sesión con email y contraseña
- Mantener sesión activa
- Cerrar sesión de forma segura

## 🎨 Modo Oscuro

La aplicación incluye un sistema completo de modo oscuro que:
- Detecta automáticamente la preferencia del sistema
- Permite cambio manual
- Guarda la preferencia en localStorage
- Se aplica en toda la interfaz

## 📱 Responsive Design

Optimizada para:
- Dispositivos móviles (375px+)
- Tablets (768px+)
- Desktop (1024px+)
- Pantallas grandes (1440px+)
