# Tattoo Innova

Una aplicación web moderna para previsualizar tatuajes usando inteligencia artificial. Permite a los usuarios subir fotos de su cuerpo y diseños de tatuajes para ver cómo se verían antes de hacérselos.

## 🚀 Características

- **Previsualización de Tatuajes**: Utiliza IA para mostrar cómo se vería un diseño de tatuaje en la piel del usuario
- **Autenticación Completa**: Sistema de login y registro con NextAuth.js
- **Tipos de Usuario**: Soporte para usuarios normales (Clientes) y tatuadores
- **Editor de Zona Interactivo**: Herramienta avanzada con Konva.js para marcar exactamente dónde se colocará el tatuaje
- **Cálculo de Precios**: Estimación automática de costos basada en el tamaño del tatuaje
- **Modo Oscuro**: Interfaz adaptable con soporte para tema claro y oscuro
- **Responsive Design**: Optimizada para dispositivos móviles y desktop
- **WebSockets en Tiempo Real**: Procesamiento de imágenes con actualizaciones en vivo
- **Contenedorización**: Lista para deployment con Docker
- **Cloudflare Workers**: Soporte para deployment serverless

## 🛠️ Tecnologías

- **Frontend**: Next.js 15.5.4 con React 19.1.0
- **Autenticación**: NextAuth.js v5.0.0-beta.29
- **Estilos**: TailwindCSS 4.0
- **UI/UX**: Lucide React para iconos
- **Editor Gráfico**: Konva.js para edición de imágenes
- **WebSockets**: Socket.io-client para comunicación en tiempo real
- **HTTP Client**: Axios
- **Lenguaje**: TypeScript
- **Contenedores**: Docker
- **Serverless**: Cloudflare Workers con OpenNext.js
- **Móvil**: Capacitor para aplicaciones híbridas

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/auth/           # Endpoints de autenticación
│   ├── login/              # Página de login/registro
│   ├── overview/           # Panel principal de la aplicación
│   ├── clients/            # Gestión de clientes
│   ├── appointments/       # Gestión de citas
│   ├── marketplace/        # Marketplace de diseños
│   ├── portafolio/         # Portafolio de tatuadores
│   ├── profile/            # Perfil de usuario
│   ├── layout.tsx          # Layout principal con providers
│   └── page.tsx            # Página de inicio
├── components/
│   ├── navbar/             # Barra de navegación
│   ├── overview/           # Componentes del dashboard
│   ├── preview/            # Componentes de previsualización
│   └── portafolio/         # Componentes del portafolio
├── context/
│   ├── DarkModeContext.tsx # Contexto para modo oscuro
│   └── SessionProviderWrapper.tsx # Proveedor de sesiones
├── hooks/
│   ├── useImagePreview.tsx # Hook para procesamiento de imágenes
│   ├── UsePreviewTattoo.tsx # Hook para funcionalidad de preview
│   ├── useAppointments.tsx # Hook para citas
│   ├── UsePortafolio.tsx   # Hook para portafolio
│   └── UseProfile.tsx      # Hook para perfil
├── types/
│   ├── auth.ts             # Tipos de autenticación
│   ├── appointment.ts      # Tipos de citas
│   ├── portafolio.ts       # Tipos de portafolio
│   └── preview.ts          # Tipos de previsualización
├── websockets/
│   ├── baseWebSocket.ts    # WebSocket base
│   ├── appointmentWebSocket.ts # WebSocket para citas
│   ├── previewWebSocket.ts # WebSocket para preview
│   └── index.ts            # Exportaciones de WebSockets
├── auth.ts                 # Configuración de NextAuth
└── middleware.ts           # Middleware de autenticación
```

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd tattoo-innova
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
docker run -p 3000:3000 tattoo-ai-superapp
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta ESLint para verificar el código
- `npm run build:worker` - Construye la aplicación para Cloudflare Workers
- `npm run dev:worker` - Ejecuta la aplicación en modo desarrollo con Cloudflare Workers
- `npm run preview:worker` - Construye y ejecuta la aplicación con Cloudflare Workers
- `npm run deploy:worker` - Despliega la aplicación a Cloudflare Workers

## 🎯 Características Principales

### Sistema de Autenticación
- Login y registro de usuarios
- Autenticación basada en credenciales con NextAuth.js
- Soporte para dos tipos de usuario: Cliente y Tatuador
- Redirección automática después del login
- Gestión de sesiones segura

### Previsualización de Tatuajes
- Carga de imagen del cuerpo
- Carga de diseño del tatuaje
- Editor de zona interactivo con Konva.js para marcar área específica
- Cálculo automático de precios basado en dimensiones
- Generación de previsualización con IA vía WebSockets
- Procesamiento en tiempo real con barra de progreso
- Descarga del resultado final

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

## ☁️ Cloudflare Workers

La aplicación incluye soporte completo para deployment serverless con Cloudflare Workers:

### Desarrollo Local con Workers
```bash
npm run dev:worker
```

### Construcción para Workers
```bash
npm run build:worker
```

### Preview Local
```bash
npm run preview:worker
```

### Deployment a Producción
```bash
npm run deploy:worker
```

## 📱 Aplicación Móvil

La aplicación incluye soporte para aplicaciones móviles híbridas usando Capacitor:

### Construir para Android
```bash
npx cap add android
npx cap sync android
npx cap run android
```

### Construir para iOS
```bash
npx cap add ios
npx cap sync ios
npx cap run ios
```
