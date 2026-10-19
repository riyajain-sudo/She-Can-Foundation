# She Can Foundation contact-form demo

This repository is a React/Vite frontend and Express API demonstration. **It does not currently deliver or retain contact messages:** `connectDB()` is deliberately disabled, and the API returns HTTP 503 with a demo-only explanation when storage is unavailable. The interface must not treat that response as success. No email service or credentials are configured. Do not submit real personal information to this demo.

## Setup

Use Node.js 20+ and npm. From the repository root:

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env.local
npm run dev
```

The UI is at `http://localhost:5173`; the API is at `http://localhost:5000`. The root `npm run dev` starts both workspaces. `npm run build` builds the client. You can also start only the API with `npm run server` or the client with `npm run client`.

The environment examples contain placeholders/defaults only. `PORT` selects the API port, `CLIENT_URL` is the one permitted browser origin, and `MONGO_URI` is an example name for a future database connection; the current connector does not use it. `VITE_API_URL` is a public client-side setting (default `http://localhost:5000/api`), never a secret. For non-local deployments, configure the API URL and permitted client origin explicitly.

## Contact API and privacy

`POST /api/contacts` accepts JSON with string `name` (up to 80 characters), `email` (up to 254), and `message` (up to 1,000). Invalid input returns 400; oversized request bodies return 413. In the current disconnected demo it returns 503 and does not log, echo, email, or store contact content. A 201 response is emitted only after database creation succeeds. The contact-list endpoint is intentionally not registered; no admin authentication exists, so stored contacts are not publicly listable.

The MongoDB integration is not active; implementing real collection requires an intentional, secured connection and operational privacy/log-retention controls. Do not add a public contact-list route without authentication and authorization.

## Regression checks

```bash
node --test server/test/*.test.js
```

The tests use synthetic values and stub database creation; they do not connect to a live database, send email, or exercise a deployed service. Syntax checks alone do not verify API behavior.
