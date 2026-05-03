# Notifications Module

## Structure

- backend: Notification service backend
- frontend: React + Vite client for realtime notifications
- docker-compose.yml: Local orchestration for backend + frontend

## Run with Docker

```bash
docker compose up --build
```

Frontend: http://localhost:5173
Backend: http://localhost:4000
MongoDB: your MongoDB Atlas cluster
Redis: redis://localhost:6379

The backend expects `MONGODB_URI` and `REDIS_URL`. Set `MONGODB_URI` to your Atlas connection string before running Docker Compose.

Example:

```bash
MONGODB_URI=mongodb+srv://sahil05:<db_password>@nexusarmy.0a6ovzq.mongodb.net/?appName=nexusarmy
```

## Run Frontend Locally

```bash
cd frontend
npm install
npm run dev
```
