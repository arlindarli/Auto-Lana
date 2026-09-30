# 🚗 Auto Lana – Car Rental Management System

Auto Lana is a full-stack car rental web application designed to simplify vehicle browsing, reservations, and rental management.

🌐 **Live Website:** https://auto-lana.vercel.app/

---

## 📌 About the Project

Auto Lana allows customers to browse available vehicles and make rental reservations through a simple and modern interface.

The project also includes administrative functionality for managing vehicles, images, and reservations.

This project was developed as a practical full-stack web application using React, Spring Boot, and PostgreSQL.

---

## ✨ Features

### 👤 Customer

- Browse available rental vehicles
- View vehicle information and images
- Select rental dates
- Make vehicle reservations
- Responsive and user-friendly interface

### 🔐 Administration

- Admin authentication
- Add new vehicles
- Edit vehicle information
- Delete vehicles
- Upload multiple vehicle images
- Manage reservations
- Manage vehicle availability

---

## 🛠️ Technologies

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- REST API integration

### Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- REST API

### Database

- PostgreSQL

### Deployment

- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** PostgreSQL

---

## 🏗️ Architecture

The application follows a frontend-backend architecture:

React Frontend  
↓  
REST API  
↓  
Spring Boot Backend  
↓  
PostgreSQL Database

The frontend communicates with the backend through REST API requests.

---

## 📂 Project Structure

```text
auto-lana/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   └── pom.xml
│
└── README.md
