#!/bin/sh

# This is a simple script to wait for the database to be ready.
# In a real production setup, this would be more robust.
echo "Waiting for postgres..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Apply database migrations
echo "Applying database migrations..."
python src/manage.py migrate

# Start server
echo "Starting server..."
python src/manage.py runserver 0.0.0.0:8000