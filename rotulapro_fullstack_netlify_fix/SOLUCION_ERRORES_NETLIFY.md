# Solución rápida de errores en Netlify para RotulaPro

## 1. Si el login dice credenciales inválidas
Usa:

```txt
Correo: Yeiroa2003@gmail.com
Contraseña: admin123
```

También confirma que ejecutaste `backend/database/schema.sql` en Supabase.

## 2. Si `/api/health` da 404
Tu backend no se desplegó. Sube el proyecto por GitHub o con Netlify CLI, no solo arrastrando el ZIP como sitio estático.

## 3. Si `/api/health` funciona pero el login falla
Revisa variables de entorno en Netlify:

```env
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET
```

Después vuelve a desplegar.

## 4. Si el registro no manda correo
Revisa:

```env
RESEND_API_KEY
ADMIN_EMAIL
RESEND_FROM
APP_URL
```

Si usas `onboarding@resend.dev`, Resend puede limitar destinatarios. Para producción conviene verificar un dominio propio.

## 5. Si IA falla
Revisa:

```env
OPENAI_API_KEY
OPENAI_MODEL
```

## 6. Si Euro BCV falla
Puede ser bloqueo o cambio HTML del BCV. Puedes colocar tasa manual en configuración mientras se ajusta el extractor.
