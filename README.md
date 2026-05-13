# FinTrack 💸

App para gestionar gastos compartidos entre grupos de amigos, familia o pareja. Permite registrar gastos, dividirlos entre los miembros del grupo y llevar un seguimiento de quién debe qué.

## ✨ Funcionalidades

- Registro e inicio de sesión con JWT
- Crear grupos (amigos, familia, pareja, trabajo)
- Agregar gastos al grupo con división automática o manual
- Ver balance de lo que debés y te deben
- Marcar splits como pagados
- Gestión de wallets (efectivo, tarjetas, cuentas)
- Sistema de contactos con solicitudes de amistad
- Actividad reciente en el dashboard
- Tiempo real con Socket.io

## 🛠️ Stack

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- Socket.io
- JWT + bcryptjs
- TypeScript

**Frontend**
- Next.js 15
- TypeScript
- Tailwind CSS
- Axios
- Chart.js

## 📁 Estructura del proyecto
fintrack/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── lib/
│   │   └── index.ts
│   └── prisma/
│       └── schema.prisma
└── frontend/
└── src/
├── app/
├── components/
├── context/
└── lib/

## 🚀 Instalación

### Requisitos
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
npm install
```

Creá un archivo `.env` en `backend/`:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/fintrack"
JWT_SECRET="tu_secret"
PORT=4000
```

Corré las migraciones:

```bash
npx prisma migrate dev
```

Iniciá el servidor:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📱 Pages

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión |
| `/register` | Registro de usuario |
| `/dashboard` | Resumen general |
| `/groups` | Lista de grupos |
| `/groups/new` | Crear grupo |
| `/groups/[id]` | Detalle del grupo y gastos |
| `/expenses` | Todos los gastos del usuario |
| `/wallets` | Gestión de wallets |
| `/contacts` | Contactos y solicitudes |
| `/profile` | Perfil del usuario |

## 🔌 API Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### Users
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users/me` | Perfil del usuario |
| PUT | `/api/users/person` | Actualizar perfil |

### Groups
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/groups` | Mis grupos |
| POST | `/api/groups` | Crear grupo |
| POST | `/api/groups/:id/members` | Agregar miembro |

### Expenses
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/expenses/me` | Mis gastos |
| GET | `/api/expenses/group/:id` | Gastos de un grupo |
| POST | `/api/expenses` | Crear gasto |
| PUT | `/api/expenses/splits/:id/paid` | Marcar como pagado |

### Wallets
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/wallets` | Mis wallets |
| POST | `/api/wallets` | Crear wallet |
| DELETE | `/api/wallets/:id` | Eliminar wallet |

### Contacts
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/contacts` | Mis contactos |
| GET | `/api/contacts/search` | Buscar usuarios |
| POST | `/api/contacts` | Enviar solicitud |
| GET | `/api/contacts/requests` | Solicitudes recibidas |
| PUT | `/api/contacts/requests/:id` | Aceptar o rechazar |
| DELETE | `/api/contacts/:id` | Eliminar contacto |

## 📋 Pendiente

- [ ] Invitar contactos a grupos
- [ ] Simplificación de deudas
- [ ] Notificaciones en tiempo real
- [ ] Gráficos con Chart.js
- [ ] Editar y eliminar gastos
- [ ] Abandonar grupos
- [ ] Exportar gastos a CSV
- [ ] App mobile con React Native