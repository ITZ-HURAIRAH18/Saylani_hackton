# 🌍 DonorHub – Charity & Donation Management System

DonorHub is a full-stack **MERN-based platform** designed to connect NGOs and donors through a transparent and user-friendly system. It simplifies campaign management, donation tracking, and ensures transparency between NGOs and their supporters.

---

## 🚀 Features

### 👥 For Donors

* Browse active NGO campaigns
* Donate securely online
* Track personal donation history
* Support causes you care about

### 🏢 For NGOs

* Create & manage campaigns
* Track received donations
* Manage donor engagement
* View analytics of campaigns

### 🔐 Authentication

* Secure login & signup (JWT / session-based)
* Role-based dashboards (**Donor** & **NGO**)

### 📊 Dashboards

* NGO Dashboard: Create campaigns, manage donations
* Donor Dashboard: View donation history, explore campaigns

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React (Vite)
* 🎨 Tailwind CSS

### Backend

* 🐍 Node.js / Express.js
* 🍃 MongoDB (Mongoose)

### Other Tools

* 🔄 Redux Toolkit (state management)
* 🔑 JWT Authentication
* 🌐 Axios (API requests)

---

## 📂 Project Structure

```
DonorHub/
│── backend/          # Node.js + Express API
│── frontend/         # React + Tailwind UI
│── README.md         # Project documentation
```

---

## ⚡ Installation

### Clone the repo

```bash
git clone https://github.com/your-username/donorhub.git
cd donorhub
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside `backend/` with:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

For `frontend/`, you may configure API base URL in `axiosInstance.js`.

---


## 🤝 Contributing

Contributions are welcome! If you’d like to improve DonorHub, please fork the repo and submit a PR.

---


## 💡 Future Improvements

* Payment gateway integration (Stripe/PayPal)
* Email / SMS donation reminders
* AI-based donor-cause recommendations

