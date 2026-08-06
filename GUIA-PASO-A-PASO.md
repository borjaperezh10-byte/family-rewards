# Family Rewards — Guía paso a paso (para principiantes)

Esta guía te lleva de la mano, sin dar nada por sabido, desde el archivo que has descargado hasta tener la app funcionando en el iPad de los niños y en tu iPhone. **No necesitas instalar nada en el ordenador ni saber programar.** Todo se hace pinchando en páginas web.

- **Tiempo aproximado:** 30–45 minutos la primera vez.
- **Qué necesitas:** un ordenador con navegador (Chrome, Edge, Safari o Firefox), el iPad, el iPhone y una dirección de correo electrónico.
- **Coste:** 0 €. Todo lo que usamos tiene plan gratuito.

> Consejo: haz los pasos en orden y sin prisa. Al final de cada parte hay un "✅ Cómo saber que ha ido bien".

---

## Antes de empezar: ¿qué vamos a hacer? (en cristiano)

Vamos a poner la app en internet para que funcione en los dos dispositivos y compartan los datos. Para eso usamos tres servicios gratuitos:

1. **GitHub** = una "caja fuerte" en internet donde se guardan los archivos de la app.
2. **Firebase** = la "libreta compartida" en la nube donde se apuntan las tareas, monedas, etc. Es lo que hace que el iPad y el iPhone vean lo mismo.
3. **Vercel** = el que coge los archivos de GitHub y los publica como una página web con una dirección (URL) que puedes abrir en cualquier móvil.

Al final, en el iPad y el iPhone abrirás esa dirección y la "guardarás" como si fuera una app normal.

No hace falta que entiendas los detalles; solo sigue los pasos.

---

## Parte 0 — Descomprimir el archivo

1. Localiza el archivo `family-rewards-app.zip` que has descargado (normalmente en la carpeta **Descargas**).
2. Haz doble clic para descomprimirlo (en Windows: clic derecho → **Extraer todo**; en Mac: doble clic).
3. Se creará una carpeta llamada `family-rewards-app` con varios archivos y carpetas dentro (`src`, `public`, `index.html`, etc.).

✅ **Cómo saber que ha ido bien:** ves la carpeta `family-rewards-app` y, dentro, una carpeta `src` que contiene `App.jsx`, `firebase.js` y `main.jsx`.

---

## Parte 1 — Subir los archivos a GitHub

### 1.1 Crear una cuenta
1. Ve a **https://github.com**.
2. Pulsa **Sign up** (registrarse) y sigue los pasos: correo, contraseña y un nombre de usuario. Confirma el correo que te envían.

### 1.2 Crear el "repositorio" (la caja de archivos)
1. Arriba a la derecha, pulsa el **+** → **New repository**.
2. En **Repository name** escribe: `family-rewards`.
3. Déjalo en **Public** (o Private, da igual para esto).
4. **No** marques ninguna casilla de abajo ("Add a README", etc.).
5. Pulsa el botón verde **Create repository**.

### 1.3 Subir los archivos
1. En la página que aparece, busca un enlace que dice **uploading an existing file** (o ve a **Add file → Upload files**).
2. Abre la carpeta `family-rewards-app` en tu ordenador.
3. Selecciona **todo lo que hay dentro** (los archivos y las carpetas `src` y `public`) y **arrástralo** a la zona del navegador que dice "Drag files here".
   - Importante: sube **el contenido** de la carpeta, no la carpeta comprimida ni el `.zip`.
   - Si tu navegador no deja arrastrar carpetas, prueba con **Chrome**, que sí lo permite.
4. Abajo, pulsa el botón verde **Commit changes** (confirmar cambios).

✅ **Cómo saber que ha ido bien:** en tu repositorio ves la lista de archivos, incluida la carpeta `src` y el archivo `package.json`.

---

## Parte 2 — Crear la base de datos en Firebase

### 2.1 Crear el proyecto
1. Ve a **https://console.firebase.google.com** e inicia sesión con tu cuenta de Google.
2. Pulsa **Agregar proyecto** (o "Create a project").
3. Ponle un nombre, por ejemplo `family-rewards`. Pulsa **Continuar**.
4. Si te pregunta por **Google Analytics**, puedes **desactivarlo** (no lo necesitas). Pulsa **Crear proyecto** y espera a que termine.

### 2.2 Crear la base de datos (Firestore)
1. En el menú de la izquierda, entra en **Compilación (Build) → Firestore Database**.
2. Pulsa **Crear base de datos**.
3. Elige una ubicación cercana (por ejemplo `eur3` para Europa). Pulsa **Siguiente**.
4. Cuando pregunte por el modo, elige **Comenzar en modo de prueba** y pulsa **Habilitar**. Espera a que se cree.

### 2.3 Ajustar las reglas de seguridad
1. Dentro de Firestore, arriba, pulsa la pestaña **Reglas** (Rules).
2. Borra lo que haya y pega **exactamente** esto:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /families/{familyId} {
      allow read, write: if true;
    }
  }
}
```
3. Pulsa **Publicar** (Publish).

> ¿Qué significa esto? Que cualquiera que conozca tu dirección web pueda leer/escribir los datos de la familia. Para uso familiar es suficiente; en el Paso 6 usaremos un identificador difícil de adivinar como candado extra.

### 2.4 Conseguir las "llaves" de conexión (firebaseConfig)
1. Arriba a la izquierda, pulsa la **rueda dentada ⚙️ → Configuración del proyecto**.
2. Baja hasta la sección **Tus apps** y pulsa el icono de web **`</>`**.
3. Ponle un apodo (ej. `family-rewards-web`) y pulsa **Registrar app**. **No** marques Firebase Hosting.
4. Verás un bloque de código con algo así:
```
const firebaseConfig = {
  apiKey: "AIza........",
  authDomain: "family-rewards-xxxx.firebaseapp.com",
  projectId: "family-rewards-xxxx",
  storageBucket: "family-rewards-xxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:1234:web:abcd...."
};
```
5. **Deja esta pestaña abierta** (o copia ese bloque en un bloc de notas). Lo necesitas en la Parte 3.

✅ **Cómo saber que ha ido bien:** tienes a la vista tus valores `apiKey`, `projectId`, `appId`, etc.

---

## Parte 3 — Pegar tus llaves en la app (editando en GitHub)

1. Vuelve a la pestaña de **GitHub**, a tu repositorio.
2. Entra en la carpeta **`src`** y pincha en el archivo **`firebase.js`**.
3. Arriba a la derecha del archivo, pulsa el icono del **lápiz ✏️** (Edit this file).
4. Verás unas líneas con valores `TU_API_KEY`, `TU_PROYECTO`, etc. **Sustituye cada uno** por el valor correspondiente de tu `firebaseConfig`:
   - `apiKey` → donde pone `TU_API_KEY`
   - `authDomain` → `TU_PROYECTO.firebaseapp.com`
   - `projectId` → `TU_PROYECTO`
   - `storageBucket` → `TU_PROYECTO.appspot.com`
   - `messagingSenderId` → `TU_MESSAGING_SENDER_ID`
   - `appId` → `TU_APP_ID`
   - Respeta las comillas `"..."`. Cambia solo lo de dentro de las comillas.
5. Abajo, pulsa **Commit changes** (verde) y confirma.

✅ **Cómo saber que ha ido bien:** en `firebase.js` ya no queda ningún `TU_...`; están tus valores reales entre comillas.

> Error típico: dejar un `TU_...` sin cambiar, o borrar una comilla. Si la app luego sale en blanco, casi siempre es esto.

---

## Parte 4 — Publicar la app con Vercel

1. Ve a **https://vercel.com**.
2. Pulsa **Sign Up** y elige **Continue with GitHub** (entrar con GitHub). Autoriza el acceso cuando te lo pida.
3. Ya dentro, pulsa **Add New… → Project**.
4. Verás la lista de tus repositorios de GitHub. Busca `family-rewards` y pulsa **Import**.
5. No cambies nada de la configuración (Vercel reconoce el proyecto solo). Pulsa **Deploy**.
6. Espera 1–2 minutos. Cuando termine, verás confecti y un botón para ver la web. Tu dirección será algo como:
   `https://family-rewards-xxxx.vercel.app`
7. Copia esa dirección; la usarás en los móviles.

✅ **Cómo saber que ha ido bien:** abres esa dirección en el ordenador y aparece la pantalla de bienvenida de Family Rewards ("¡Vamos a montar la fiesta!").

> Si sale una pantalla en blanco: revisa la Parte 3 (las llaves de Firebase). Corrige `firebase.js` en GitHub, haz Commit, y Vercel volverá a publicar solo en un par de minutos.

---

## Parte 5 — Instalar la app en el iPad y en el iPhone

Hazlo **en los dos dispositivos**. En iPhone/iPad **tiene que ser con Safari** (no vale Chrome para este paso).

1. Abre **Safari** y entra en tu dirección de Vercel (`https://family-rewards-xxxx.vercel.app`).
2. Pulsa el botón **Compartir** (el cuadrado con la flecha hacia arriba, abajo en el iPhone / arriba en el iPad).
3. En el menú, baja y pulsa **Añadir a pantalla de inicio**.
4. Pulsa **Añadir** (arriba a la derecha).
5. Ahora tendrás el icono de Family Rewards en la pantalla de inicio. Ábrelo desde ahí: se ve a pantalla completa, como una app.

- En el **iPad de los niños**: déjalo en **modo niño**.
- En tu **iPhone**: pulsa **Modo padres** e introduce el PIN.

✅ **Cómo saber que ha ido bien:** el icono aparece en la pantalla de inicio y, al abrirlo, no se ve la barra del navegador.

---

## Parte 6 — Que los dos dispositivos compartan la MISMA familia

Muy importante para que el iPad y el iPhone vean lo mismo.

- Por defecto, todos comparten el grupo `familia-principal`, así que en principio ya funciona.
- Para un identificador propio y más difícil de adivinar (recomendado), añade `?family=` y una palabra tuya al final de la dirección, **y usa exactamente la misma en los dos dispositivos** al añadirla a la pantalla de inicio. Ejemplo:
  `https://family-rewards-xxxx.vercel.app/?family=casa-lopez-73`

Si ya los habías añadido con la dirección normal y quieres cambiar al identificador propio: borra el icono de la pantalla de inicio en ambos y vuelve a hacer la Parte 5 usando la dirección con `?family=...`.

✅ **Cómo saber que ha ido bien:** creas una tarea en el iPad y, a los pocos segundos, aparece en el iPhone (o al revés).

---

## Parte 7 — Activar los avisos en tu iPhone

1. En el iPhone, abre la app **desde el icono de la pantalla de inicio** (no desde Safari).
2. Entra en **Modo padres**.
3. Arriba a la derecha pulsa **🔕 Activar avisos** y, cuando iOS lo pida, pulsa **Permitir**.

A partir de ahí, cuando Diego o Martina marquen una tarea, te llega una notificación y la pestaña **Aprobaciones** muestra un número con lo que hay pendiente.

> Nota: este aviso funciona con la app abierta o hace poco que la usaste. El aviso con la app totalmente cerrada es un añadido posterior (FCM); no es imprescindible para empezar.

---

## Parte 8 — Primera configuración dentro de la app

La primera vez, la app te guía con un asistente:
1. **Nombre de la familia** (opcional) y nombres de los hijos: **Diego** y **Martina**. Puedes ponerles foto.
2. Elige unas **tareas** iniciales para cada uno.
3. Elige unas **recompensas** iniciales.
4. Crea un **PIN** de 4 dígitos para el modo padres (apúntalo).

Después, en **modo padres → pestaña Ajustes**, te recomiendo:
- Dejar la **penalización desactivada** al principio.
- **Días comodín: 1** (que un despiste no rompa la racha).
- Elegir un **color** para cada hijo.
- Marcar como **"🏠 Responsabilidad familiar"** las tareas que no quieras premiar con monedas, y como **"🪙 Con recompensa"** las que sí.

---

## Si algo no funciona (problemas típicos)

- **La web sale en blanco:** casi siempre es un fallo en `firebase.js` (Parte 3). Revisa que no quede ningún `TU_...` y que no falte ninguna comilla. Corrige en GitHub → Commit → espera 2 min.
- **"Missing or insufficient permissions" o no guarda nada:** falta publicar las reglas de Firestore (Parte 2.3).
- **No aparece "Añadir a pantalla de inicio":** estás usando Chrome en el móvil; hazlo con **Safari**.
- **El iPad y el iPhone no ven lo mismo:** asegúrate de que ambos usan el **mismo** `?family=...` (o ninguno). Comprueba también que ambos abren la **misma dirección** de Vercel.
- **No llegan las notificaciones:** ábrela desde el icono de la pantalla de inicio (no desde Safari), en modo padres, y vuelve a pulsar Activar avisos.
- **Cambios que no se ven:** tras editar en GitHub, Vercel tarda 1–2 minutos en volver a publicar. Refresca la página.

## Cómo cambiar cosas más adelante
No hace falta volver a empezar. Edita el archivo que quieras en GitHub (lápiz ✏️ → Commit) y Vercel republica solo. Los móviles cogen la versión nueva al abrir la app.

## Diccionario rápido
- **Repositorio (repo):** la carpeta de tu proyecto guardada en GitHub.
- **Commit:** guardar un cambio en GitHub.
- **Deploy / Desplegar:** publicar la app para que sea accesible por internet (lo hace Vercel).
- **Firestore:** la base de datos en la nube (dentro de Firebase).
- **PWA:** una web que se "instala" en el móvil y se comporta como una app.
