# GestionProductos

Monorepo con:

- `frontend-marketplace`: app Next.js para Vercel
- `backend-marketplace`: API Node.js/Express para Render
- `init.sql`: datos de prueba para Railway/MySQL

## Despliegue recomendado

- Vercel:
  usa `frontend-marketplace` como Root Directory
- Render:
  usa `backend-marketplace` como Root Directory

## Variables importantes

- Frontend:
  `NEXT_PUBLIC_API_URL`
- Backend:
  `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `JWT_SECRET`, `FRONTEND_URLS`
