# Task Management Application

This project is a full-stack task management application built with React + TypeScript on the frontend, Node.js + Express (with TypeScript) on the backend, and PostgreSQL for data storage. It supports user authentication (registration/login) and task management (view, add, update, delete) for authenticated users.

---

## Optional: Run with Docker Compose

For a hassle‑free setup, you can use Docker Compose to run PostgreSQL, the backend, and the frontend without manually installing and configuring each service.

### How to Use Docker Compose

1. **Prerequisites:**  
   Make sure you have [Docker](https://www.docker.com/get-started) and Docker Compose installed.

2. **Configuration:**  
   The repository includes a `docker-compose.yml` file at the root. Before starting, update the following (if needed):
   - Replace `yourPassword` with your desired PostgreSQL password.
   - Ensure the environment variables in the file (such as `DATABASE_URL` and `JWT_SECRET`) are correct.


3. **Starting the Stack:**  
   From the repository's root directory, run:
   ```bash
   docker-compose up -d
   ```
   This command will start three services:
   - **db:** PostgreSQL (mapped to host port 5433 if 5432 is in use)
   - **backend:** Node.js/Express API (accessible at http://localhost:5001)
   - **frontend:** React app served via Nginx (accessible at http://localhost:3000)

  
After starting the containers, you must create the tables by running the following SQL commands:

1. Connect to the PostgreSQL container:
   ```bash
   docker exec -it taskmanager_db psql -U postgres -d taskdb
   ```
2. At the `taskdb=#` prompt, run:
   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       username VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL
   );

   CREATE TABLE tasks (
       id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       description TEXT,
       is_complete BOOLEAN DEFAULT false,
       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
   );
   ```

4. **Stopping the Stack:**  
   To stop all services, run:
   ```bash
   docker-compose down
   ```

If you prefer to set up PostgreSQL manually, follow the instructions below.

---

## Overview

The application allows users to:
- **Register** and **Login** (with password hashing and JWT authentication).
- **View**, **Create**, **Update**, and **Delete** tasks (all protected by authentication).

---

## Prerequisites (Non-Docker Setup)

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (installed locally)

---

## Setup Instructions

### 1. Fork and Clone the Repository

1. Fork this repository on GitHub.
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/your-forked-repo.git
   cd your-forked-repo
   ```

### 2. Database Setup (Non-Docker)

1. **Install PostgreSQL** if not already installed:
   - **macOS (via Homebrew):**
     ```bash
     brew install postgresql
     brew services start postgresql
     ```
   - **Windows:**  
     Download the installer from [postgresql.org](https://www.postgresql.org/download/windows/).
   - **Linux (Debian/Ubuntu):**
     ```bash
     sudo apt update
     sudo apt install postgresql postgresql-contrib
     sudo service postgresql start
     ```
2. **Create the Database and Tables:**
   - Connect to PostgreSQL:
     ```bash
     psql -U postgres
     ```
   - Create a new database and connect to it:
     ```sql
     CREATE DATABASE taskdb;
     \c taskdb
     ```
   - Create the `users` table:
     ```sql
     CREATE TABLE users (
         id SERIAL PRIMARY KEY,
         username VARCHAR(255) UNIQUE NOT NULL,
         password VARCHAR(255) NOT NULL
     );
     ```
   - Create the `tasks` table:
     ```sql
     CREATE TABLE tasks (
         id SERIAL PRIMARY KEY,
         title VARCHAR(255) NOT NULL,
         description TEXT,
         is_complete BOOLEAN DEFAULT false,
         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
     );
     ```

### 3. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a `.env` file in the backend directory with the following content (adjust credentials as needed):
   ```env
   DATABASE_URL=postgresql://postgres:yourPassword@localhost:5432/taskdb
   JWT_SECRET=G9s8F3kH1lZ7mQ2vB4rT6yJ0pD8wS3eL5xA7nC1oI9uE4tV2qR8X7p2K3L9o0m1Q
   PORT=5001
   ```
3. Install backend dependencies:
   ```bash
   npm install
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   You should see a message: `Server running on port 5001`

### 4. Frontend Setup

1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```
   The React app will typically open at [http://localhost:3000](http://localhost:3000).

---

## Testing the Application

### Backend Testing
- **Registration:**  
  Use Postman to send a POST request to `http://localhost:5001/auth/register` with a JSON body:
  ```json
  {
    "username": "testuser",
    "password": "testpassword"
  }
  ```
- **Login:**  
  Use Postman to send a POST request to `http://localhost:5001/auth/login` with the same credentials.
- **Tasks:**  
  Test the tasks endpoints (`GET`, `POST`, `PUT`, `DELETE` at `http://localhost:5001/tasks`) by including an `Authorization` header:
  ```
  Authorization: Bearer G9s8F3kH1lZ7mQ2vB4rT6yJ0pD8wS3eL5xA7nC1oI9uE4tV2qR8X7p2K3L9o0m1Q
  ```

### Frontend Testing
- Use the registration form to create a new account.
- Log in using the login form. The app stores your JWT token in localStorage.
- Manage tasks (create, update, delete) using the tasks page.

---

## Additional Notes

- **Environment Variables:**  
  Ensure your backend `.env` file contains the correct PostgreSQL connection string and JWT secret.
- **CORS:**  
  The backend has CORS enabled to allow requests from the frontend.
- **UI Design:**  
  The frontend features a modern, minimalist design with custom CSS.
- **Salary Expectations:**  
  My expected monthly salary is $6000/month.

---

## Video Demo

A short demo video showing user registration, login, and task management can be found in the `DEMO.md` file (or follow the provided link below):

[Link to Demo Video](#)

---

Thank you for reviewing my submission!