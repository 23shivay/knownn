#  Knownn – Pseudonymous Community Platform

**Knownn** is a real-time, pseudonymous platform built for colleges and organizations. It brings together individuals with the same email domain (e.g., `@college.edu`) into a private, trusted space where they can share, discuss, and support each other — without revealing their identity.

---

## 🚨 Problem Statement

People often hesitate to share thoughts on career struggles, academic stress, or social issues due to fear of judgment. Existing platforms lack true anonymity or domain-specific relevance, leaving users disconnected from relatable peer communities.

---

## 🎯 Objective

To create a safe, domain-restricted community where users can:
- Post and comment anonymously  
- Share content suggestions  
- Report or react without identity exposure  
- Chat in real-time with people they actually know (same college or organization)

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
```bash
git clone https://github.com/23shivay/knownn.git
cd knownn
npm install
```
---

Setup Instructions
1. PostgreSQL
Run PostgreSQL locally or via Aiven.io

Add credentials to .env inside packages/db

2. Kafka & Redis
Run Redis and Kafka locally or via Aiven

Add credentials to .env inside apps/server
---

### 3. Prisma Migration

```bash
cd packages/db
npx prisma migrate dev
```


