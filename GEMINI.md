# Project Overview

This project is an AI Support & Search Agent for Ornitech. It consists of a Next.js frontend and a FastAPI backend.

**IMPORTANT:** The project is currently being restructured into a `frontend`/`backend` monorepo. The files have not yet been moved.

## Current (temporary) Structure

- **Root:** Contains the Next.js application files (`app`, `public`, `package.json`, etc.) and the `backend` directory.
- **`backend/`:** Contains the FastAPI application.

## Target Structure

- **`frontend/`:** Will contain the Next.js application.
- **`backend/`:** Contains the FastAPI application.

# Building and Running

## Frontend (Next.js)

To run the frontend, navigate to the root directory and run:

```bash
npm install
npm run dev
```

*(Once the files are moved, you will run these commands from the `frontend` directory.)*

## Backend (FastAPI)

To run the backend, navigate to the `backend` directory and run the following commands:

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

# Development Conventions

(This section will be updated once the project structure is finalized)
