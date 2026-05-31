# RotulaPro Netlify

Sistema cotizador de rotulaciones con:

- Login real con JWT
- Registro con aprobación de usuarios
- Roles: súper administrador, administrador, rotulador/vendedor
- Cotizador en USD y Bs
- Tasa Euro BCV automática
- IA para estimar medidas de rotulación vehicular
- Base de datos Supabase/PostgreSQL
- Correos de solicitud con Resend
- Despliegue en Netlify Functions

## Estructura

```txt
rotulapro/
  frontend/                 # HTML/CSS/JS
  netlify/functions/api.js  # Backend serverless para Netlify
  backend/src/              # Rutas, servicios y middleware reutilizados
  backend/database/schema.sql
  netlify.toml
  .env.example
  NETLIFY_DEPLOY.md
```

## Variables obligatorias

Configúralas en Netlify, no dentro del código:

```env
SUPABASE_URL=https://bkpgprbxqqkdktndoqoj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=Yeiroa2003@gmail.com
RESEND_API_KEY=
RESEND_FROM=RotulaPro <onboarding@resend.dev>
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
JWT_SECRET=
APP_URL=
BCV_URL=https://www.bcv.org.ve/
```

## Base de datos

Ejecuta en Supabase SQL Editor:

```txt
backend/database/schema.sql
```

Usuario inicial:

```txt
Correo: Yeiroa2003@gmail.com
Contraseña: admin123
```

## Probar localmente

```bash
npm install
cp .env.example .env
npm run dev
```

Luego abre:

```txt
http://localhost:8888
```

## Desplegar en Netlify

Lee:

```txt
NETLIFY_DEPLOY.md
```

## Seguridad

No subas claves privadas al repositorio. Las claves de Resend, OpenAI y Supabase service role deben vivir en variables de entorno de Netlify con alcance para Functions.
