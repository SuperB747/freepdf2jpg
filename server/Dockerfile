# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=5001
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    poppler-utils \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code and gunicorn config
COPY . .

# Create directory for logs and temporary files
RUN mkdir -p /app/logs /app/tmp && \
    chmod 777 /app/logs /app/tmp

# Expose the port Flask runs on
EXPOSE 5001

# Run the application using gunicorn with the config file
CMD ["gunicorn", "--config", "gunicorn.conf.py", "app:app"]