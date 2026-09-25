# Smart Link Hub

A full-stack web application that allows users to create, manage, and share multiple links through a single personalized profile. It also provides QR code generation for convenient sharing and access across devices.

## Live Demo

**Live Website:** https://kaleidoscopic-kashata-e7a4d7.netlify.app/

**GitHub Repository:** https://github.com/Lalithavemula/Smart-Link-Hub

---

## Features

* User registration and login
* Secure authentication using JWT
* Personalized user profile
* Create and manage multiple links
* Edit and delete links
* Public link sharing
* QR code generation
* QR code scanning from mobile devices
* Profile image management
* Responsive user interface
* REST API-based frontend and backend communication
* Cloud deployment

---

## Tech Stack

### Frontend

* React
* JavaScript
* HTML
* CSS
* Tailwind CSS
* Vite

### Backend

* Java
* Spring Boot
* Spring Security
* REST APIs
* JWT Authentication
* Maven

### Database

* MySQL
* Flyway Database Migration

### Deployment

* Netlify — Frontend
* Render — Backend
* Railway — MySQL Database

### Version Control

* Git
* GitHub

---

## System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    │  Web / Mobile       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Netlify        │
                    │   React Frontend    │
                    └──────────┬──────────┘
                               │
                         REST API / HTTPS
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Render        │
                    │   Spring Boot API   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Railway        │
                    │     MySQL DB        │
                    └─────────────────────┘
```

---

## How It Works

1. A user creates an account and logs in.
2. The application authenticates the user using JWT.
3. The user can create and manage links from the dashboard.
4. Link information is stored in the MySQL database.
5. The application generates a public URL for each link.
6. Users can generate a QR code for sharing.
7. Anyone can scan the QR code and access the shared link.
8. The frontend communicates with the Spring Boot backend through REST APIs.

---

## Project Structure

```text
Smart-Link-Hub/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
└── README.md
```

---

## Installation and Setup

### Prerequisites

Make sure you have installed:

* Java 17+
* Node.js
* npm
* MySQL
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/Lalithavemula/Smart-Link-Hub.git
cd Smart-Link-Hub
```

---

## Backend Setup

Navigate to the backend:

```bash
cd backend
```

Configure the required environment variables for the database and JWT authentication.

Then run the Spring Boot application using your IDE or Maven.

The backend runs on:

```text
http://localhost:8081
```

---

## Frontend Setup

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8081
```

Start the development server:

```bash
npm run dev
```

The frontend will be available through the Vite development URL shown in the terminal.

---

## Production Deployment

The application is deployed using separate services:

| Component | Platform      |
| --------- | ------------- |
| Frontend  | Netlify       |
| Backend   | Render        |
| Database  | Railway MySQL |

### Production Backend

```text
https://smart-link-hub-backend-e3rn.onrender.com
```

### Production Frontend

```text
https://kaleidoscopic-kashata-e7a4d7.netlify.app/
```

---

## Security

* JWT-based authentication
* Password authentication
* Protected API endpoints
* Environment variables for sensitive configuration
* HTTPS for production communication

Sensitive credentials such as database passwords and JWT secrets are not stored in the source code.

---

## Key Learning Outcomes

Through this project, I worked with:

* Full-stack application development
* React frontend development
* Spring Boot REST API development
* JWT authentication
* Spring Security
* MySQL database integration
* Database migrations using Flyway
* Frontend-backend integration
* Git and GitHub
* Cloud deployment
* Debugging production issues
* QR-based link sharing

---

## Future Enhancements

* Link click analytics
* Custom short URLs
* Link expiration
* Link categories
* Social media integrations
* Advanced profile customization
* Improved analytics dashboard

---

## Author

**Lalitha Vemula**

GitHub: https://github.com/Lalithavemula

---

## License

This project is created for educational and portfolio purposes.
