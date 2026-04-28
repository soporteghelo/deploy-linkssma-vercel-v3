# LINKSSMA V2

## Descripción
LINKSSMA V2 es una aplicación web desarrollada en Google Apps Script y HTML/JavaScript que permite visualizar, buscar y navegar documentos, comunicados y capacitaciones de manera centralizada y visualmente atractiva. Incluye funcionalidades como:

- Visualización de comunicados destacados en un carrusel automático.
- Navegación por categorías con paginación.
- Búsqueda instantánea con resaltado de resultados.
- Visualización de detalles de cada documento, incluyendo imágenes, videos, enlaces y archivos embebidos (YouTube, Google Drive, MP4, etc).
- Modal de emergencia y feedback de usuario.
- Efectos visuales modernos (linterna, animaciones, zoom de imagen, etc).

## Instalación y despliegue

### Requisitos
- Cuenta de Google con acceso a Google Apps Script.
- Acceso a Google Drive para almacenar los archivos y datos.
- Navegador web moderno (Chrome, Edge, Firefox, Safari).

### Pasos de instalación

1. **Clonar el proyecto**
   - Descarga o copia los archivos `Code.gs`, `Index.html`, `JavaScript.html` y `Styles.html` en tu Google Apps Script.

2. **Configurar el proyecto en Google Apps Script**
   - Ve a [Google Apps Script](https://script.google.com/) y crea un nuevo proyecto.
   - Sube los archivos mencionados a tu proyecto.
   - Asegúrate de que `Index.html` sea el archivo principal de interfaz.

3. **Vincular con Google Sheets (opcional)**
   - Si la app obtiene datos de una hoja de cálculo, configura el acceso y los permisos necesarios en el archivo `Code.gs`.

4. **Desplegar como aplicación web**
   - En el editor de Apps Script, ve a `Implementar > Nueva implementación`.
   - Selecciona "Aplicación web".
   - Define los permisos de acceso (por ejemplo, "Cualquiera" o "Solo usuarios de la organización").
   - Haz clic en "Implementar" y copia la URL generada.

5. **Compartir la app**
   - Comparte la URL de la app con los usuarios finales.

## Uso

- Navega por las categorías para ver los documentos disponibles.
- Utiliza la barra de búsqueda para encontrar documentos rápidamente.
- Haz clic en los comunicados destacados para ver más detalles.
- Usa el botón de emergencia para acceder a información relevante en caso de incidentes.
- Envía sugerencias o feedback desde el botón correspondiente.

## Personalización
- Puedes modificar los íconos, colores y estilos en `Styles.html`.
- Para agregar nuevas categorías o cambiar la lógica de datos, edita `Code.gs` y/o la fuente de datos (Google Sheets).

## Soporte
Para dudas, sugerencias o reportes de errores, contacta al administrador del proyecto o deja tu feedback usando la funcionalidad incluida en la app.

## LINK
Aqui el link de produccion para volver a APP: 
https://script.google.com/macros/s/AKfycbyUrDay6coAQlF8yaebIPI3l46jLCX3VGm88LAnNrIt95FtOmcmyk0MVjSbAE6s1h7g-g/exec

Se genera a partir de un appscrit: PRUEBAS_APP; v0 sin titulo

---

**Desarrollado por:** Tu equipo de TI / Automatización
**Fecha:** Abril 2026
