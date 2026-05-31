# Desplegar RotulaPro en Netlify

RotulaPro está preparado para Netlify usando:

- Frontend estático en `/frontend`
- Backend en Netlify Functions en `/netlify/functions/api.js`
- Base de datos en Supabase
- Correo con Resend
- IA con OpenAI
- Tasa Euro BCV automática desde el backend

## 1. Crear la base de datos

En Supabase:

1. Abre tu proyecto.
2. Ve a **SQL Editor**.
3. Copia y ejecuta todo el archivo:

```txt
backend/database/schema.sql
```

Ese archivo crea:

- usuarios
- configuración
- materiales
- tasa BCV
- cotizaciones
- piezas cotizadas
- órdenes

También crea el súper administrador inicial:

```txt
Correo: Yeiroa2003@gmail.com
Contraseña: admin123
```

Después de entrar, cambia esa clave.

## 2. Variables de entorno en Netlify

En Netlify ve a:

```txt
Site configuration > Environment variables
```

Agrega estas variables:

```env
SUPABASE_URL=https://bkpgprbxqqkdktndoqoj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY_DE_SUPABASE
ADMIN_EMAIL=Yeiroa2003@gmail.com
RESEND_API_KEY=TU_RESEND_API_KEY_NUEVA
RESEND_FROM=RotulaPro <onboarding@resend.dev>
OPENAI_API_KEY=TU_OPENAI_API_KEY
OPENAI_MODEL=gpt-4.1-mini
JWT_SECRET=UNA_CLAVE_LARGA_SEGURA
APP_URL=https://TU-SITIO.netlify.app
BCV_URL=https://www.bcv.org.ve/
```

Importante:

- `SUPABASE_SERVICE_ROLE_KEY` nunca debe ir en el frontend.
- `RESEND_API_KEY` debe ser nueva si ya fue expuesta.
- `OPENAI_API_KEY` solo debe estar en Netlify Functions.
- Asegúrate de que el alcance de las variables incluya **Functions**.


## Error común: no uses Drag & Drop para esta versión

Esta app tiene backend en Netlify Functions. Si solo arrastras el ZIP o la carpeta al área de "manual deploy", puede subir el HTML pero las rutas `/api/...` pueden fallar porque las funciones no se construyen como en un deploy desde Git o CLI.

Usa una de estas dos opciones:

1. GitHub conectado a Netlify.
2. Netlify CLI con `netlify deploy --build`.

## 3. Subir a Netlify

### Opción recomendada: GitHub

1. Sube esta carpeta a un repositorio de GitHub.
2. En Netlify presiona **Add new site**.
3. Elige **Import an existing project**.
4. Conecta GitHub.
5. Selecciona el repositorio.
6. Netlify detectará `netlify.toml`.
7. Publicará `/frontend` y desplegará `/netlify/functions`.

Configuración esperada:

```txt
Build command: npm run build
Publish directory: frontend
Functions directory: netlify/functions
```

### Opción manual

Evita arrastrar el ZIP directamente para esta versión, porque RotulaPro necesita Netlify Functions para login, correo, IA y Supabase.

## 4. Probar que el backend funciona

Cuando Netlify publique tu sitio, abre:

```txt
https://TU-SITIO.netlify.app/api/health
```

Debe responder algo parecido a:

```json
{
  "ok": true,
  "app": "RotulaPro",
  "runtime": "Netlify Functions"
}
```

## 5. Login inicial

Entra al sitio y usa:

```txt
Correo: Yeiroa2003@gmail.com
Contraseña: admin123
```

## 6. Tasa Euro BCV automática

Desde el panel de administrador:

1. Entra a **Precios y configuración**.
2. Presiona **Actualizar Euro BCV automático**.
3. El sistema consulta el BCV y actualiza la tasa en Supabase.

Si el BCV cambia su estructura HTML o bloquea temporalmente la consulta, puedes editar la tasa manualmente desde configuración.

## 7. Correos de registro

Cuando un usuario se registre:

1. Se guarda como `pending`.
2. Resend envía un correo a `ADMIN_EMAIL`.
3. El administrador entra al panel **Usuarios**.
4. Aprueba o rechaza.
5. Asigna rol: `Administrador` o `Rotulador / Vendedor`.

## 8. IA en tiempo real

En **Nueva cotización**:

1. Escribe marca, modelo y año.
2. Selecciona partes a rotular.
3. Presiona **Estimar con IA**.
4. La IA devuelve medidas aproximadas.
5. RotulaPro suma 10 cm por lado y calcula el material.

Siempre se debe confirmar físicamente antes de imprimir o cortar.
