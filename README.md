
# Go + React Web App (with JWT Auth)

This is a full-stack web application built with **Go** and **React**, utilizing **MySQL** as the database. The application features user authentication using **JWT** (JSON Web Tokens) for secure login, registration, and logout processes. After logging in, users are directed to a homepage.
## Prerequisites

Before running this project, ensure you have the following installed:

- **Go** (version 1.23.1 or later)
- **Node.js** (version 18.18.0 or later)
- **npm** (version 9.8.1 or later)
- **MySQL** (installed and running)
## Installation

#### Clone the repository:
```bash
git clone https://github.com/dobromirpetrov00/edit-profile-go-react-jwt-mysql.git
cd edit-profile-go-react-jwt-mysql
```

#### Install dependencies for the back end:
```bash
cd server
go mod tidy
```

#### Install dependencies for the front end:
```bash
cd client
npm install
npm install --save-dev @types/css-modules
```
#### Create database in MySQL:
- Set up a MySQL database for the application (e.g., use a command like `CREATE DATABASE your_database_name;`).
## Environment Variables

#### Create a `.env` file in the `client` folder with the following variable:
- `REACT_APP_API_URL=http://localhost:8000`

#### Create a `.env` file in the `server` folder with the following variables:
- `DB_USERNAME=your_database_username`
- `DB_PASSWORD=your_database_password`
- `DB_IP=127.0.0.1:3306`
- `DB_NAME=your_database_name`
- `JWT_SECRET_KEY=your_jwt_secret_key`
- `ALLOWED_ORIGINS=http://localhost,http://localhost:8000,http://localhost:3000,http://your_local_ip:3000,http://your_local_ip:8000` (used for CORS configuration)
- `SERVER_PORT=:8000` (the port on which the server will run)
## In the project directory you can run:

#### To start the server:
```bash
cd server
go run main.go
```

#### To start the web app:
```bash
cd client
npm start
```

#### Open the web app in your browser:
- Visit [http://localhost:3000](http://localhost:3000) to access the application.
## API endpoints:

- `POST /api/register` - Register a new user
- `POST /api/login` - Log in to an existing account
- `POST /api/logout` - Log out of the current session
- `GET /api/user` - Retrieve user information
- `DELETE /api/user` - Delete the current user
## Web app endpoints

- `/` - Homepage
- `/login` - Login page
- `/register` - User registration page
## Features
- **User Authentication**: Users can register, log in, and log out.
- **JWT Authentication**: JSON Web Tokens are used for secure authentication.
- **Homepage**: After logging in, users are redirected to the homepage.
- **User Information**: Users can view and edit their information, including username, email, and password.
- **User Deletion**: Users can delete their account.
- **Error Handling**: The application handles errors gracefully and provides informative error messages.
## License

This project is licensed under the **9061** License.
