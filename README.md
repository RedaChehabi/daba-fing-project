# DabaFing Project

DabaFing is a fingerprint analysis and management system that allows users to upload, store, and analyze fingerprint images.

## Project Overview

The project consists of two main components:
- A Django REST API backend for handling data storage and fingerprint analysis
- A Next.js frontend for user interaction and visualization

## Tech Stack

### Backend
- Django 4.2+
- Django REST Framework
- PostgreSQL
- Docker & Docker Compose
- Pillow for image processing

### Frontend
- Next.js 13+
- React
- Tailwind CSS
- TypeScript

## Project Structure

## Database Access

### Using Django Admin Interface

1. Ensure your Django backend is running:
   ```bash
   docker-compose up -d backend db
   ```