# Style Engine: The AI-Powered Fashion Recommender

Welcome to the Style Engine project! This repository contains the source code for a sophisticated, AI-powered fashion recommendation system designed to provide users with personalized clothing suggestions based on their personality, body type, and lifestyle.

## Table of Contents

- [Project Vision](#project-vision)
- [Core Features](#core-features)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Getting Started: Development Setup](#getting-started-development-setup)
  - [Prerequisites](#prerequisites)
  - [Option 1: Native Local Development (Fastest Hot Reloading)](#option-1-native-local-development-fastest-hot-reloading)
  - [Option 2: Docker-Based Development (Production Parity)](#option-2-docker-based-development-production-parity)
- [Initial Data Setup](#initial-data-setup)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

---

## Project Vision

The Style Engine is not just another e-commerce recommender. Our goal is to create a "personal stylist in your pocket." By moving beyond simple purchase history and instead focusing on a user's core identity—captured through an interactive quiz—we provide recommendations that empower users to express themselves through fashion.

---

## Core Features

- **Interactive Personality Quiz:** A single-page form covering body type, lifestyle needs, and visual style preferences.
- **Rule-Based Recommendation Engine:** A sophisticated filtering and weighting system to create a personalized "capsule wardrobe".
- **Pluggable AI Core:** Architected with an adapter pattern to seamlessly switch between the initial rule-based engine and a future LLM-powered curator (e.g., Google Gemini or a self-hosted vLLM).
- **Rich Product Catalog:** A fully-tagged dataset of clothing items, manageable via a secure admin interface.

---

## Architecture Overview

This project is built using a modern, decoupled **Service-Oriented Architecture (SOA)** to ensure scalability, maintainability, and flexibility.

-   **Frontend:** A **Next.js (React)** application that provides the entire user interface. It is completely decoupled from the backend and communicates exclusively via a REST API.
-   **Backend:** A **Django** application serving a REST API. It contains all business logic for the quiz, user profiles, and the recommendation engine. It also provides the Django Admin Panel for data management.
-   **Data Layer:**
    -   **PostgreSQL:** The primary database and single source of truth for all user and product data.
    -   **Elasticsearch:** A high-performance search engine used for fast, complex filtering of the product catalog.

All services are containerized with Docker for production consistency.

---

## Technology Stack

-   **Backend:** Python, Django, Django Rest Framework, Django-CORS-Headers, Django-Elasticsearch-DSL
-   **Frontend:** TypeScript, Next.js, React, Tailwind CSS, dotenv-cli
-   **Database:** PostgreSQL
-   **Search:** Elasticsearch
-   **Containerization:** Docker, Docker Compose
-   **AI (Future):** Google Gemini, vLLM

---

## Getting Started: Development Setup

### Prerequisites

1.  **Git:** To clone the repository.
2.  **Node.js v18+ & npm:** For the frontend.
3.  **Python 3.11+ & pip:** For the backend.
4.  **Docker & Docker Compose:** Required for running background services and for the full Docker-based setup.

First, clone the repository and create your local environment files by copying the examples:

```bash
git clone <your-repo-url>
cd style-engine
cp .env.docker.example .env.docker
cp .env.local.example .env.local
```

### Option 1: Native Local Development (Fastest Hot Reloading)

This setup is recommended for day-to-day feature development. We run data services in Docker, but the frontend and backend applications run directly on your host machine for maximum performance and faster hot-reloading.

**Step 1: Start Background Services**

Open a terminal in the project root. This command starts PostgreSQL and Elasticsearch in the background.

```bash
docker-compose up -d db es
```

**Step 2: Set Up and Run the Backend**

Open a **new terminal window**.

```bash
# 1. Navigate to the backend directory and set up the environment
cd backend
python -m venv venv
source venv/bin/activate
# On Windows, use: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements/base.txt

# 3. IMPORTANT: Run the initial data setup (see "Initial Data Setup" section for details)
# This only needs to be done once per new database.
# You will run 'python src/manage.py migrate' and other commands.

# 4. Start the Django development server
python src/manage.py runserver
```

Your Django API is now running on `http://localhost:8000`.

**Step 3: Set Up and Run the Frontend**

Open a **third terminal window**.

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the Next.js development server with Turbopack
npm run dev
```

Your Next.js app is now running on `http://localhost:3000`.

### Option 2: Docker-Based Development (Production Parity)

This setup runs the entire application stack inside Docker containers, guaranteeing your environment is identical to production.

```bash
# 1. From the project root, build and start all services
docker-compose up --build

# 2. In a new terminal, run the one-time data setup commands (see below)
```

-   Frontend will be available at `http://localhost:3000`.
-   Backend API will be available at `http://localhost:8000`.
-   Django Admin will be at `http://localhost:8000/admin/`.

To stop all services, press `Ctrl+C` in the `docker-compose up` terminal. To stop and remove the containers, run `docker-compose down`.

---

## Initial Data Setup

This project requires a **one-time setup** to initialize the databases. You must run these commands after starting your services for the first time.

The product catalog data is located at `backend/src/data/product_catalog.csv`.

### Instructions for Native Local Development

After starting your background services (`docker-compose up -d db es`), run these commands from the `backend/` directory with your virtual environment active.

```bash
# In the backend/ directory:

# 1. Create the PostgreSQL database tables
python src/manage.py migrate

# 2. Import the product catalog from the CSV into PostgreSQL
python src/manage.py import_products src/data/product_catalog.csv

# 3. Create and populate the Elasticsearch index from PostgreSQL
# NOTE: This command must be run via Docker to ensure it can see both services.
# Go back to the project root directory first.
cd ../
docker-compose exec backend python src/manage.py search_index --rebuild -f
```

### Instructions for Docker-Based Development

After `docker-compose up` is running, open a **new terminal** and run these commands from the **project root**.

```bash
# 1. Create the PostgreSQL database tables
docker-compose exec backend python src/manage.py migrate

# 2. Import the product catalog from the CSV into PostgreSQL
docker-compose exec backend python src/manage.py import_products src/data/product_catalog.csv

# 3. Create the Elasticsearch index and populate it from PostgreSQL
docker-compose exec backend python src/manage.py search_index --rebuild -f
```

After these steps, your databases are fully initialized and ready.

---

## Running Tests

(This section is a placeholder for when tests are added.)

To run backend tests:
```bash
docker-compose exec backend python src/manage.py test
```

To run frontend tests:
```bash
docker-compose exec frontend npm run test
```

---

## Deployment

Deployment is handled via CI/CD workflows defined in the `.github/workflows` directory. Pushing to the `main` branch will trigger the `deploy.yml` workflow, which builds and pushes the production Docker images to a container registry and deploys them to our cloud infrastructure (e.g., Google Cloud Run or GKE).