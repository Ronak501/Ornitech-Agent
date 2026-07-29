# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend directory contents into the container at /app
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application using Uvicorn
# Google Cloud Run expects apps to listen on port 8080 by default
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
