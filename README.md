
# 📸 Photo Share Web Application

A cloud-native, full-stack photo sharing app built with **Node.js + MySQL + Azure Blob Storage** on the backend and **React + Tailwind CSS** on the frontend.

## 🚀 Features

- **User Authentication** (JWT-based)
- **Creator Dashboard**: Upload images with title, caption, location & people
- **Consumer Feed**: View media, like, comment, and rate images
- **Image Storage**: Azure Blob integration
- **Role-based Access** (creator vs consumer)
- **Scalable Cloud Architecture** (deployable on Azure)

---

## 📁 Project Structure

```
photo-share/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── media.js
│   │   └── user.js
│   ├── models/
│   │   ├── user.js
│   │   ├── media.js
│   │   ├── comment.js
│   │   ├── rating.js
│   │   └── like.js
│   ├── utils/
│   │   └── azureBlob.js
│   ├── db.js
│   └── app.js
├── frontend/
│   └── photo-app-frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── Creator.jsx
│       │   │   ├── Feed.jsx
│       │   │   └── LogoutButton.jsx
│       │   ├── App.jsx
│       │   ├── index.css
│       │   └── index.js
```

---

## 🧑‍💻 Getting Started

### 🟦 Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure `.env`**
   ```env
   DB_HOST=your_azure_mysql_host
   DB_USER=username
   DB_PASSWORD=password
   DB_NAME=photoapp
   AZURE_STORAGE_CONNECTION_STRING=...
   AZURE_CONTAINER_NAME=mediauploads
   JWT_SECRET=your_jwt_secret
   ```

3. **Run the server**
   ```bash
   node app.js
   # or with nodemon:
   npm run dev
   ```

---

### 🟩 Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend/photo-app-frontend
   npm install
   ```

2. **Start the app**
   ```bash
   npm start
   ```

3. **Tailwind Setup** (already configured in `index.css`)

---

## 📦 API Overview

| Method | Endpoint                     | Description                      |
|--------|------------------------------|----------------------------------|
| POST   | `/api/auth/register`         | Register user                    |
| POST   | `/api/auth/login`            | Login and get JWT token          |
| POST   | `/api/media/upload`          | Upload image (creator only)      |
| GET    | `/api/media`                 | Get all media                    |
| POST   | `/api/media/:id/like`        | Like an image                    |
| POST   | `/api/media/:id/comments`    | Comment on image                 |
| POST   | `/api/media/:id/rate`        | Rate an image (1–5)              |

---

## 🧠 Future Ideas

- Public image gallery
- Admin dashboard
- User profile pages
- Image moderation tools

---

## 📜 License

MIT — for academic/demo use.
