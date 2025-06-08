FROM python:3.11-slim-buster

WORKDIR /usr/src/app

COPY . .

RUN pip install -r requirements.txt

EXPOSE 3000

ENTRYPOINT ["python", "app.py"]

# FROM python:3.10-slim

# WORKDIR /usr/src/app

# EXPOSE 3001

# COPY package*.json ./

# COPY . .


# RUN pip install --no-cache-dir -r requirements.txt

# EXPOSE 5000

# CMD ["python", "app.py"]