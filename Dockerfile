FROM python:3.11-slim

# Prevent Python from writing pyc files and buffer logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create non-root user with no login shell
RUN groupadd -r appgroup && \
    useradd -r -g appgroup -d /app -s /usr/sbin/nologin appuser

WORKDIR /app

# Install dependencies first for better layer caching
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Set ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Django development server port
EXPOSE 5000

CMD ["python", "backend/manage.py", "runserver", "0.0.0.0:5000"]
