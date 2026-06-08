# LINKSSMA V3 — Gestión documental

Aplicación web de gestión documental para AESA, desplegada como PWA y lista para Vercel.

## Descripción
LINKSSMA V3 es una aplicación web orientada a la gestión documental, con acceso rápido a contenidos, accesos directos, navegación por categorías y soporte PWA.

Características principales:
- Accesos directos circulares y contenido dinámico.
- Categorías y búsqueda instantánea.
- Modal de feedback y modal de acceso directo embebido.
- Soporte PWA con `manifest.json`, `service worker` y `LOGO.png` como icono.
- Título de la app: `Gestión documental`.

## Archivos clave
- `index.html` — interfaz principal.
- `app.js` — lógica de la aplicación y renderizado dinámico.
- `manifest.json` — configuración PWA.
- `sw.js` — service worker.
- `vercel.json` — configuración de despliegue en Vercel.
- `api/*.js` — funciones de API desplegadas en Vercel.
- `package.json` — scripts y dependencias.

## Instalación local

### Requisitos
- Node.js instalado.
- Navegador moderno.

### Ejecutar en desarrollo
```bash
npm install
npm run dev
```

Abre `http://localhost:3000` para ver la app en desarrollo.

## Despliegue en Vercel

1. Conecta el repositorio a Vercel.
2. Configura el proyecto con la raíz del repositorio.
3. Usa `npm install` como comando de build.
4. Asegúrate de que `manifest.json`, `sw.js`, `LOGO.png` y `index.html` estén disponibles en la raíz.
5. Despliega y verifica que la app cargue correctamente.

## Soporte PWA e instalación
- El `manifest.json` define el nombre `Gestión documental`.
- El navegador usará `/LOGO.png` como icono.
- En navegadores compatibles, se puede mostrar el botón de instalación PWA.

## Notas
- Si necesitas actualizar las rutas de datos o los accesos directos, edita `app.js`.
- El contenido de la sección de accesos directos se carga dinámicamente desde la API en `api/directos.js`.

---

**Desarrollado por:** Equipo de TI / Automatización
**Fecha:** Junio 2026
