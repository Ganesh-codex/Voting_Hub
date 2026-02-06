Voting Hub – Online Voting System

A full-stack web application that allows users to securely vote for candidates, while admins can manage candidates and view live vote counts.

🔗 Live Backend: https://voting-hub-1.onrender.com/

🚀 Features
👤 Voter

Secure login using Aadhar number & password

View all candidates

Cast vote (one vote per user)

See live vote count updates

🛠️ Admin

Admin login with role-based access

Add new candidates

Delete candidates

View total votes and party-wise statistics

Visual vote chart display

🧰 Tech Stack
Frontend

HTML, CSS, JavaScript

Fetch API for backend communication

Chart.js for vote visualization

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

CORS enabled for cross-origin requests

Deployment

Backend hosted on Render

Database hosted on MongoDB Atlas

📂 Project Structure
Voting_Hub/
│
├── Backend/
│   ├── routes/
│   ├── models/
│   ├── db.js
│   ├── server.js
│   └── .env
│
├── Frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md

⚙️ Environment Variables

Create a .env file inside the Backend folder:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


On Render, add these in
Dashboard → Service → Environment Variables

🧪 Running Locally
1️⃣ Clone the repository
git clone https://github.com/Ganesh-codex/Voting_Hub.git
cd Voting_Hub

2️⃣ Setup Backend
cd Backend
npm install
npm start

3️⃣ Open Frontend

Open Frontend/index.html using Live Server or host it locally.

🔐 Authentication Flow

User logs in → backend verifies credentials

Server returns JWT token

Token stored in browser localStorage

Protected routes use Authorization: Bearer <token>

🌐 API Endpoints
Method	Endpoint	Description
POST	/user/login	User login
GET	/user/profile	Get logged-in user info
GET	/candidate	Get all candidates
POST	/candidate	Add candidate (Admin)
DELETE	/candidate/:id	Delete candidate (Admin)
GET	/candidate/vote/:id	Vote for candidate
GET	/candidate/vote/count	Get vote counts
📊 Live Vote Updates

Vote counts refresh automatically every 10 seconds using polling.
Project Screenshot 
<img width="1280" height="760" alt="1770133346923" src="https://github.com/user-attachments/assets/6801ee7f-2b61-4356-bed0-f1f2cb885e6d" />

<img width="1280" height="770" alt="1770133334805" src="https://github.com/user-attachments/assets/f9e2341d-334d-4088-97ec-d1a21c659bea" />
<img width="1280" height="782" alt="1770133299946" src="https://github.com/user-attachments/assets/6669eb80-cdc8-4972-a402-a3efbd4e873e" />

🧑‍💻 Author

Ganesh Pandey
B.Tech – Artificial Intelligence & Machine Learning
Passionate about full-stack development & problem solving.

📜 License

This project is for educational purposes.
