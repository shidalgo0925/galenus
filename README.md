# Galenus Panamá - Sitio Web Moderno

Un rediseño moderno y responsivo del sitio web de Galenus Panamá, una empresa farmacéutica comprometida con la excelencia en el cuidado de la salud.

## 🚀 Características

### Diseño Moderno
- **Diseño limpio y minimalista** con enfoque en la experiencia del usuario
- **Colores profesionales** que transmiten confianza y profesionalismo
- **Tipografía moderna** usando Inter para una excelente legibilidad
- **Iconografía consistente** con Font Awesome

### Responsive Design
- **Completamente responsivo** para todos los dispositivos
- **Mobile-first approach** para una experiencia óptima en móviles
- **Breakpoints optimizados** para tablets y escritorio
- **Navegación adaptativa** con menú hamburguesa en móviles

### Características Técnicas
- **PWA (Progressive Web App)** - Instalable como app nativa
- **Modo oscuro** con persistencia de preferencias
- **Animaciones suaves** y microinteracciones
- **Optimización de rendimiento** con lazy loading
- **Accesibilidad mejorada** (WCAG 2.1 AA)
- **SEO optimizado** con meta tags y estructura semántica

### Funcionalidades
- **Navegación suave** entre secciones
- **Filtro de productos** interactivo
- **Formulario de contacto** con validación
- **Notificaciones** para feedback del usuario
- **Service Worker** para funcionalidad offline

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica y accesible
- **CSS3** - Estilos modernos con variables CSS y Grid/Flexbox
- **JavaScript ES6+** - Interactividad y funcionalidades avanzadas
- **Font Awesome** - Iconografía profesional
- **Google Fonts** - Tipografía Inter
- **PWA** - Service Worker y Web App Manifest

## 📁 Estructura del Proyecto

```
galenus-panama/
├── index.html          # Página principal
├── styles.css          # Estilos principales
├── script.js           # JavaScript principal
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── README.md          # Documentación
└── assets/            # Recursos estáticos
    ├── icons/         # Iconos PWA
    ├── images/        # Imágenes
    └── screenshots/   # Capturas para PWA
```

## 🎨 Paleta de Colores

- **Primario**: #2563eb (Azul profesional)
- **Secundario**: #10b981 (Verde salud)
- **Acento**: #f59e0b (Amarillo dorado)
- **Texto**: #1f2937 (Gris oscuro)
- **Fondo**: #ffffff (Blanco limpio)

## 📱 Secciones del Sitio

### 1. Header/Navegación
- Logo y nombre de la empresa
- Menú de navegación responsivo
- Toggle de modo oscuro
- Menú hamburguesa para móviles

### 2. Hero Section
- Título principal impactante
- Descripción de la empresa
- Botones de llamada a la acción
- Elementos visuales animados

### 3. Sobre Nosotros
- Misión y valores de la empresa
- Características destacadas
- Estadísticas de la empresa
- Diseño en grid responsivo

### 4. Servicios
- Tarjetas de servicios con iconos
- Descripción detallada de cada servicio
- Lista de características
- Efectos hover y animaciones

### 5. Productos
- Filtro de categorías interactivo
- Grid de productos responsivo
- Badges de categorización
- Animaciones de entrada

### 6. Contacto
- Información de contacto completa
- Formulario con validación
- Horarios de atención
- Integración con redes sociales

### 7. Footer
- Enlaces rápidos organizados
- Información legal
- Redes sociales
- Disclaimer médico

## 🚀 Instalación y Uso

1. **Clonar o descargar** los archivos del proyecto
2. **Servir los archivos** desde un servidor web (no abrir directamente)
3. **Personalizar** el contenido según las necesidades específicas
4. **Optimizar imágenes** y agregar recursos faltantes
5. **Configurar** el service worker para el entorno de producción

## 📊 Optimizaciones de Rendimiento

- **Lazy loading** de imágenes
- **Preload** de recursos críticos
- **Minificación** de CSS y JavaScript
- **Compresión** de imágenes
- **Caching** inteligente con Service Worker
- **Critical CSS** inline

## ♿ Accesibilidad

- **Navegación por teclado** completa
- **ARIA labels** y roles semánticos
- **Contraste** de colores optimizado
- **Texto alternativo** para imágenes
- **Estructura semántica** HTML5
- **Soporte para lectores de pantalla**

## 🔧 Personalización

### Cambiar Colores
Modifica las variables CSS en `:root` dentro de `styles.css`:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #10b981;
  /* ... más variables */
}
```

### Agregar Contenido
1. **Productos**: Modifica la sección de productos en `index.html`
2. **Servicios**: Actualiza las tarjetas de servicios
3. **Información de contacto**: Cambia los datos en la sección de contacto
4. **Imágenes**: Reemplaza las referencias a iconos con imágenes reales

### Configurar PWA
1. **Iconos**: Agrega iconos en diferentes tamaños en la carpeta `icons/`
2. **Manifest**: Personaliza `manifest.json` con información específica
3. **Service Worker**: Configura las rutas de API en `sw.js`

## 📈 SEO y Marketing

- **Meta tags** optimizados
- **Open Graph** para redes sociales
- **Schema.org** markup (recomendado agregar)
- **Sitemap.xml** (recomendado crear)
- **Robots.txt** (recomendado crear)

## 🔒 Seguridad

- **HTTPS** obligatorio para PWA
- **CSP headers** recomendados
- **Validación** de formularios en frontend y backend
- **Sanitización** de inputs del usuario

## 📞 Soporte

Para soporte técnico o consultas sobre la implementación, contacta al equipo de desarrollo.

## 📄 Licencia

Este proyecto está diseñado específicamente para Galenus Panamá. Todos los derechos reservados.

---

**Galenus Panamá** - Soluciones Farmacéuticas Innovadoras

