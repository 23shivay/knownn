


# 🕶️ Knowwn – Pseudonymous Community Platform

**Knowwn** is a real-time, Pseudonymous platform built for colleges and organizations. It brings together individuals with the same email domain (e.g., `@college.edu`) into a private, trusted space where they can share, discuss, and support each other — without revealing their identity.

---

## 🚨 Problem Statement

People often hesitate to share thoughts on career struggles, academic stress, or social issues due to fear of judgment. Existing platforms lack true anonymity or domain-specific relevance, leaving users disconnected from relatable peer communities.

---

## 🎯 Objective

To create a safe, domain-restricted community where users can:
- Post and comment anonymously
- Share content suggestions
- Report or react without identity exposure
- Chat in real-time with people they actually know (same college or org)

---

## 🛠️ Built With

- **Next.js** – Frontend & API layer  
- **Node.js (Express)** – Infrastructure backend  
- **Socket.io** – Real-time messaging  
- **Redis (Aiven)** – Pub/Sub for message sync  
- **Apache Kafka (Aiven)** – Durable event streaming  
- **PostgreSQL (Aiven)** – Persistent data storage  
- **Prisma ORM** – Type-safe database queries  
- **Tailwind CSS** – Frontend styling  
- **Zod** – Input validation  
- **Turborepo** – Monorepo project structure  
- **Vercel** – Frontend deployment

---

## 📦 Installation

```bash
git clone https://github.com/23shivay/knownn.git
cd knownn
npm install


## Setup Instructions
1. PostgreSQL
Run locally or via Aiven.io

Add credentials in .env inside packages/db

2. Kafka & Redis
Run locally or via Aiven

Add credentials to .env inside apps/server


Running the App
cd apps
npm run dev
The app runs locally at http://localhost:3000

🧪 Testing
Currently, testing is performed manually via:
Multiple tab/socket instances (for WebSocket testing)
Postman  (for API route testing)

---
## Project Highlights
Anonymous posting, voting, and commenting
Domain-based user isolation (e.g., @college.edu)
Real-time chat using Socket.io + Redis
Durable Kafka stream for event persistence
Prisma ORM + PostgreSQL schema modeling
Scalable backend infrastructure for 1000+ users
Deployed with Vercel & cloud-managed infra
---
📬 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.




















