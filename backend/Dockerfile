# File: backend/Dockerfile

# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install build-essential and libpq-dev
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Create media directory
RUN mkdir -p /app/media && chmod 777 /app/media

# Expose port 8000 for the Django app
EXPOSE 8000

# The command to run when the container starts
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]