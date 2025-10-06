# React_Backend Application

**Eco_byte** is a full-stack web application built with React (frontend) and Node.js/Express (backend), connected to a PostgreSQL database. The application allows users to interact with SQL data seamlessly.  

---

## Project Structure

- **Eco/**  
  - **backend/** – Node.js + Express server  
  - **frontend/** – React client  
  - **README.md** – This file


- **frontend/** – React application (UI/UX)  
- **backend/** – Node.js server handling API requests  
- **Database** – PostgreSQL (managed with pgAdmin)  
- **README.md** – Project documentation  

---

## Features / Functionality

- **Admin View**  
  - Manage users, staff, and data  
  - Monitor system activity  

- **User View**  
  - Access personal dashboard  
  - View and interact with data  

- **Staff View**  
  - Manage assigned tasks  
  - Update and track relevant data  


## Prerequisites

- Node.js and npm installed  
- PostgreSQL installed (with pgAdmin for DB management)  
- Git installed  

---

## Installation & Setup

### Backend

1. Navigate to the `backend` folder:
 ```bash
   cd backend
 ```
2. Install dependencies:
 ```bash
npm install
```
3. Configure database connection in .env file:
   ```bash
   DB_HOST=localhost
   DB_USER=yourusername
   DB_PASSWORD=yourpassword
   DB_NAME=yourdbname
   DB_PORT=5432 ```
4. Start the backend server:
```bash
  node server.js
```
Frontend
1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
   npm install
 ```
3. Start the React development server:
```bash
npm start
```
The frontend app will run at http://localhost:3000 by default.

## Database

- PostgreSQL is used as the database.  
- Manage tables and data using **pgAdmin**.  
- Ensure your `.env` file matches your database credentials.  

## Technologies Used

- **Frontend:** React, HTML, CSS, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Tools:** pgAdmin, npm, Git  

> **Note:** The login OTP is stored only in the database (`otps` table) and **will not be sent to the user’s phone**. It is used for internal authentication purposes.

## ScreenShots
**user view**
<img width="2844" height="1350" alt="image" src="https://github.com/user-attachments/assets/915eada5-b507-4399-85d3-79387d046880" />
<img width="2851" height="1351" alt="image" src="https://github.com/user-attachments/assets/022b2b93-cd9c-46fc-b7c6-df4cfdb09547" />

**Admin View**
<img width="2853" height="1351" alt="image" src="https://github.com/user-attachments/assets/0e086b27-3d1c-4048-81cb-781d884f0e79" />
<img width="2846" height="1354" alt="image" src="https://github.com/user-attachments/assets/ea4b9d14-202f-49b9-9f3d-982fed2d5900" />
<img width="2845" height="1334" alt="image" src="https://github.com/user-attachments/assets/298646f8-5657-4a0e-86e0-7a4a77245b1f" />



