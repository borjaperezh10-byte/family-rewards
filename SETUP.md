# Family Rewards — Guía definitiva de puesta en marcha

App React con sincronización en la nube (Firebase) para que el **iPad de los niños** y tu **iPhone** compartan los mismos datos en tiempo real. Se instala en cada dispositivo como PWA (añadir a pantalla de inicio). **No hace falta instalar nada en el ordenador**: todo se hace desde el navegador.

Arquitectura: iPad (modo niño) ⇄ Firestore (nube) ⇄ iPhone (modo padres). Alojamiento en Vercel (gratis).

---

## Lo que incluye esta versión
- Modo niño y modo padres (con PIN), varios hijos, cada uno con su foto y su color.
- Tareas diarias / por días de la semana / fecha concreta, con foto por tarea.
- Dos tipos de tarea: **con recompensa** (dan monedas) y **responsabilidad familiar** (no dan monedas, pero cuentan para la racha).
- Tienda de recompensas con foto, canje con aprobación de los padres.
- Monedas, racha con **días comodín**, **medallas/logros**, calendario mensual.
- **Penalización opcional** (desactivada por defecto; el saldo nunca baja de 0).
- Sonido + confeti, recompensa **sorpresa** y botón de **elogio**.
- Sincronización en tiempo real y **notificaciones** al dispositivo de los padres.

---

## Paso 1 — Subir el proyecto a GitHub (desde el navegador)
1. Descomprime este zip en tu ordenador (descomprimir no es "instalar").
2. Entra en https://github.com, crea una cuenta si no la tienes y pulsa **New repository** → nómbralo (ej. `family-rewards`) → **Create**.
3. En el repositorio vacío: **Add file → Upload files**, y arrastra **el contenido** de la carpeta `family-rewards-app` (los archivos y carpetas, no el zip). Pulsa **Commit changes**.

## Paso 2 — Crear el proyecto de Firebase (navegador)
1. Entra en https://console.firebase.google.com → **Agregar proyecto** (puedes desactivar Analytics).
2. Menú lateral → **Compilación → Firestore Database → Crear base de datos** → ubicación (ej. `eur3`) → arranca en **modo de prueba**.

## Paso 3 — Conectar la app con tu Firebase
1. En Firebase: rueda dentada ⚙️ → **Configuración del proyecto** → **Tus apps** → icono **</>** (Web) → registra la app y copia el objeto `firebaseConfig`.
2. En GitHub, abre `src/firebase.js`, pulsa el lápiz ✏️ y sustituye los valores `TU_...` por los tuyos. **Commit**.
3. En **Firestore → Reglas**, pega esto y publica:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /families/{familyId} { allow read, write: if true; }
  }
}
```
> Deja el acceso abierto a quien tenga el enlace; para uso familiar suele bastar. Usa un `family` id difícil de adivinar (ver Paso 6).

## Paso 4 — Publicar en Vercel (navegador)
1. Entra en https://vercel.com y accede **con tu cuenta de GitHub**.
2. **Add New → Project** → importa el repositorio `family-rewards`.
3. Vercel detecta Vite solo. Pulsa **Deploy**. Al terminar te da una URL pública (ej. `https://family-rewards-xxx.vercel.app`).

## Paso 5 — Instalar en el iPad y el iPhone
En **cada** dispositivo, abre la URL de Vercel en **Safari** → **Compartir → Añadir a pantalla de inicio**. Queda con el icono de la app y a pantalla completa.
- **iPad** de los niños: déjalo en **modo niño**.
- Tu **iPhone**: entra en **modo padres** (con el PIN).

## Paso 6 — (Recomendado) Mismo grupo de familia
Por defecto todos usan el grupo `familia-principal`. Para uno propio y menos adivinable, añade `?family=loquesea` a la URL **al añadirla a la pantalla de inicio en ambos dispositivos** (el mismo en los dos). Ej.: `https://.../?family=casa-1234`.

## Paso 7 — Activar las notificaciones (iPhone)
En tu iPhone, en **modo padres**, pulsa **🔕 Activar avisos** (arriba a la derecha) y acepta el permiso. Cuando Diego o Martina pidan aprobar una tarea, te llega una **notificación** y la pestaña **Aprobaciones** muestra un **contador**.
> En iOS las notificaciones web solo funcionan si la app está **añadida a la pantalla de inicio** (iOS 16.4+). Esta capa avisa con la app abierta o en segundo plano; para aviso con la app **cerrada** ver "Notificaciones capa 2" abajo.

---

## Ajustes recomendados (modo padres → pestaña Ajustes)
- **Penalización**: déjala desactivada al principio; actívala solo si lo necesitas. Nunca deja el saldo por debajo de 0 y se recupera si luego apruebas la tarea.
- **Días comodín**: 1 (un despiste no rompe la racha).
- **Color de cada hijo**: elige el suyo cambiando de pestaña de hijo.
- **Tareas**: marca como "🏠 Responsabilidad familiar" las que no quieras pagar (poner la mesa, recoger su plato...) y como "🪙 Con recompensa" las extra.
- **Recompensas**: ve rotándolas; la variedad mantiene la motivación.

## Actualizar la app más adelante
Edita cualquier archivo en GitHub (lápiz ✏️ → Commit). Vercel vuelve a desplegar solo en un par de minutos. No hay que tocar los dispositivos.

## Notificaciones capa 2 (opcional, aviso con la app cerrada)
Requiere Firebase Cloud Messaging (FCM): activar Cloud Messaging + clave VAPID, un `firebase-messaging-sw.js`, guardar el token del iPhone en Firestore y un servicio que envíe el push. Para mantenerlo **gratis sin activar tarjeta**, ese envío se pone como **función serverless en Vercel** (no en Cloud Functions de Firebase, que piden plan Blaze). Se puede añadir cuando quieras.

## Notas
- **Fotos**: se reducen bastante al subirlas para no superar el límite de 1 MB por documento de Firestore. Con unas cuantas tareas/recompensas vas sobrado.
- **App Store**: este mismo código se puede empaquetar con **Capacitor** y publicar con la cuenta de Apple Developer (99 $/año). La PWA de esta guía no necesita nada de eso.
