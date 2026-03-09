# 🏥 MedTech

MedTech is a healthcare technology platform designed to bridge the gap between **doctors and patients** by providing a centralized system for medical consultation, appointment management, and health assistance.

The goal of this project is to simplify the healthcare experience by enabling patients to easily find doctors, book appointments, and access medical guidance through a digital platform.

---

# 📌 About the Project

Healthcare accessibility remains a challenge for many people due to long waiting times, lack of information about doctors, and inefficient appointment management.

**MedTech** solves these problems by creating a digital ecosystem where:

* Patients can discover and connect with doctors easily.
* Doctors can manage appointments and patient interactions efficiently.
* Healthcare services become more organized and accessible.

This platform leverages modern web technologies to deliver a **fast, scalable, and user-friendly healthcare experience**.

---

# 🚀 Features

* 👨‍⚕️ **Doctor Listing**

  * Browse available doctors and view their details.

* 📅 **Appointment Booking**

  * Patients can schedule appointments with doctors.

* 🧑‍⚕️ **Doctor Dashboard**

  * Doctors can manage their appointments and patient interactions.

* 🤖 **AI-Based Illness Assistance**

  * AI-powered assistant to help patients understand possible health issues.

* 🔐 **Authentication System**

  * Secure login and registration for users.

* ⚡ **Modern Web Interface**

  * Built using modern frontend frameworks for a smooth user experience.

---

# 🛠 Tech Stack

### Frontend

* React / Next.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### DevOps

* Docker
* Docker Compose

---

# 📂 Project Structure

```
MedTech
│
├── client          # Frontend application
│
├── server          # Backend API
│   └── index.js
│
├── docker-compose.yml
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Run Without Docker

### Clone the Repository

```bash
git clone https://github.com/singhalgarvit/MedTech.git
cd MedTech
```

### Start the Client

```bash
cd client
npm install
npm run dev
```

### Start the Backend Server

```bash
cd ../server
npm install
node index.js
```

### Access the Application

Open your browser and go to:

```
http://localhost:5173
```

---

# 🐳 Run With Docker

Running the project with Docker ensures that the application runs in a consistent environment across different systems.

### Prerequisites

Make sure you have installed:

* Docker
* Docker Compose

### Clone the Repository

```bash
git clone https://github.com/singhalgarvit/MedTech.git
cd MedTech
```

### Start the Application

```bash
docker compose up --build
```

### Access the Application

```
Frontend: http://localhost:5173
Backend: http://localhost:2543
```

---

# 🔮 Future Improvements

* Online video consultation
* Electronic medical records
* AI-powered symptom checker
* Notifications and reminders
* Mobile application (React Native)

---

# 🤝 Contributing

Contributions are welcome!
If you would like to contribute to this project:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

# 📜 License

This project is created for educational and research purposes.

---

# 👨‍💻 Author

**Garvit Singhal**

Computer Science & Engineering Student
Passionate about building scalable web applications and solving real-world problems through technology.

---
