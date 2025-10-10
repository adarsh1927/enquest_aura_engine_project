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
- [Data Ingestion](#data-ingestion)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

---

## Project Vision

The Style Engine is not just another e-commerce recommender. Our goal is to create a "personal stylist in your pocket." By moving beyond simple purchase history and instead focusing on a user's core identity—captured through an interactive quiz—we provide recommendations that empower users to express themselves through fashion.

---

## Core Features

- **Interactive Personality Quiz:** A multi-step questionnaire covering body type, lifestyle needs, and visual style preferences.
- **Rule-Based Recommendation Engine:** A sophisticated filtering and weighting system (based on client specifications) to create a personalized "capsule wardrobe" of 40 items.
- **Pluggable AI Core:** Architected with an adapter pattern to seamlessly switch between the initial rule-based engine and a future LLM-powered curator (e.g., Google Gemini or a self-hosted vLLM).
- **Rich Product Catalog:** A fully-tagged dataset of clothing items, manageable via a secure admin interface.

---

## Architecture Overview

This project is built using a modern, decoupled **Service-Oriented Architecture (SOA)** to ensure scalability, maintainability, and flexibility.

-   **Frontend:** A **Next.js (React)** single-page application that provides the entire user interface. It is completely decoupled from the backend and communicates exclusively via a REST API.
-   **Backend:** A **Django** application serving a REST API. It contains all business logic for the quiz, user profiles, and the recommendation engine itself. It also provides the Django Admin Panel for data management.
-   **Data Layer:**
    -   **PostgreSQL:** The primary database and single source of truth for all user and product data.
    -   **Elasticsearch:** A high-performance search engine used for fast, complex filtering of the product catalog.

All services are containerized with Docker for production consistency.


*(Note: You can replace this link with a saved image from our chat in the `docs/` folder for permanence)*

---

## Technology Stack

-   **Backend:** Python, Django, Django Rest Framework
-   **Frontend:** TypeScript, Next.js, React, Tailwind CSS
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
4.  **Docker & Docker Compose:** Required for Option 2 and for running the database/search services in Option 1.

### Option 1: Native Local Development (Fastest Hot Reloading)

This setup is recommended for day-to-day feature development. We will run the database and search engine in Docker, but the frontend and backend applications will run directly on your host machine for maximum performance.

**Step 1: Start Background Services**

First, we need to start PostgreSQL and Elasticsearch using Docker.

```bash
# From the project root directory
docker-compose up -d db search
```

*(Note: We haven't added `search` to our docker-compose.yml yet, but this is where it would go. For now, just `docker-compose up -d db` is sufficient).*

**Step 2: Set Up and Run the Backend**

Open a **new terminal window**.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate
# On Windows, use: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements/base.txt

# 4. Run database migrations
# The .env file in the root is NOT used here. We need to tell Django where the DB is.
# Ensure your local .env file has DATABASE_HOST=localhost if you run this way.
# For now, we will stick to default sqlite3 for simplicity in native dev.
python src/manage.py migrate

# 5. Start the Django development server
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

Your Next.js app is now running on `http://localhost:3000`. You can open it in your browser and start coding!

### Option 2: Docker-Based Development (Production Parity)

This setup runs the entire application stack inside Docker containers. It's slightly slower to start but guarantees your environment is identical to production. This is recommended for testing the full system integration.

**Step 1: Set Up Environment**

Ensure you have a `.env` file in the project root, copied from `.env.example`.

**Step 2: Run Docker Compose**

Open a single terminal in the project root.

```bash
# Build the images and start all services
docker-compose up --build
```

That's it! Docker will build and run everything.

-   Frontend will be available at `http://localhost:3000`.
-   Backend API will be available at `http://localhost:8000`.
-   Django Admin will be at `http://localhost:8000/admin/`.

To stop all services, press `Ctrl+C`. To stop and remove the containers, run `docker-compose down`.

---

## Data Ingestion

The initial product catalog is located in `data/products.csv`. To load this data into your database, run the following Django management command after starting your backend (either natively or with Docker).

```bash
# If using Docker:
docker-compose exec backend python src/manage.py import_products data/products.csv

# If running natively:
# (from the backend/ directory with venv active)
python src/manage.py import_products ../data/products.csv
```
*(Note: We will need to create this `import_products` command and the `data/` directory).*

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