# backend/Dockerfile
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app
# Install netcat for the entrypoint script
RUN apt-get update && apt-get install -y netcat-traditional
COPY requirements/base.txt .
RUN pip install -r base.txt
COPY . .
# Make the entrypoint script executable
RUN chmod +x /app/entrypoint.sh
# Set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]