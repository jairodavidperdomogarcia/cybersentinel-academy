# Propuesta de Arquitectura: Portal Web Global

Este documento define la estructura para transformar el sitio actual (centrado solo en CyberSentinel) en un **Portal Web Moderno** completo, donde CyberSentinel es solo uno de los proyectos principales.

## 1. Concepto: "El Hub del Creador" (Main Portal)
La página principal (`index.html` raíz) dejará de ser el "Command Center" y pasará a ser la portada de tu marca personal o institucional.

### Estructura de Navegación Propuesta
*   **Inicio / Home**: Bienvenida, quién eres, visión general.
*   **Contenidos Multimedia**:
    *   🎥 **Videos**: Tutoriales, opiniones, streamings.
    *   🎙️ **Entrevistas**: Charlas con expertos, podcasts.
    *   📝 **Blog/Artículos**: Opinión técnica, noticias.
*   **Proyectos (Portafolio)**:
    *   🛡️ **CyberSentinel Academy**: *Acceso al sistema que ya hemos construido.*
    *   🔬 **Otros Proyectos**: Espacio para futuros desarrollos.
*   **Comunidad/Contacto**: Redes sociales, newsletter.

## 2. Jerarquía de Archivos (Técnica)

```text
WEB_PLATFORM/ (Raíz del Hosting)
│
├── index.html            <-- NUEVO: Landing Page Principal (Videos, Entrevistas, Bio)
├── css/                  <-- Estilos globales del portal (Moderno, limpio, profesional)
├── assets/               <-- Imágenes generales del portal
│
├── cybersentinel/        <-- CARPETA DEL PROYECTO (Lo que tenemos ahora)
│   ├── index.html        <-- El "Command Center" actual (se mueve aquí)
│   ├── manual/
│   ├── modules/
│   └── ...
│
├── videos/               <-- Sección de videos
└── blog/                 <-- Sección de artículos
```

## 3. Experiencia del Usuario (UX)
1.  **Visitante Nuevo**: Llega a `tupagina.com`. Ve tu último video, una entrevista destacada y un banner llamativo que dice "Aprende Ciberseguridad en CyberSentinel".
2.  **Estudiante**: Hace clic en "CyberSentinel". La estética cambia (o se adapta) al modo "Inmersivo/Dark" y entra al simulador (el sistema actual).

## 4. Tecnologías
*   **Portal Principal**: HTML5/CSS3 moderno (posiblemente con un framework ligero como Astro o simplemente HTML limpio) para carga rápida y SEO (Google).
*   **CyberSentinel**: Mantiene su estructura actual (React + SPA) dentro de su subcarpeta.

## 5. Preguntas de Diseño
*   ¿El portal principal debe tener la misma estética "Hacker/Dark" o algo más limpio y periodístico para las entrevistas?
*   ¿Los videos estarán alojados en YouTube/Vimeo (embebed) o directamente en el sitio?