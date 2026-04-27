FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for build
RUN apt-get update && apt-get install -y gcc g++ libpq-dev

COPY requirements.txt .
RUN pip install -r requirements.txt 

COPY . .

# Run the backend execution engine
CMD ["python", "main.py"]
