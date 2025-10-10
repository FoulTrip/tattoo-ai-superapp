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

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🚀 Deploy

### Vercel (Recomendado)
La forma más fácil de desplegar esta aplicación Next.js es usar [Vercel](https://vercel.com/new).

### Otras Plataformas
También se puede desplegar en:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## ⚙️ Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NEXTAUTH_SECRET` | Clave secreta para NextAuth.js | ✅ |
| `NEXTAUTH_URL` | URL base de la aplicación | ✅ |
| `NEXT_PUBLIC_URL_GATEWAY` | URL del API Gateway | ✅ |

## 🔧 Desarrollo

Para contribuir al desarrollo:

1. Asegúrate de tener Node.js 20+ instalado
2. Instala las dependencias con `npm install`
3. Configura las variables de entorno
4. Ejecuta `npm run dev` para iniciar el servidor de desarrollo
5. Los cambios se recargan automáticamente

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, puedes:
- Abrir un issue en GitHub
- Contactar al equipo de desarrollo

---

**Desarrollado con ❤️ usando Next.js y React**
