FROM node:alpine

COPY package.json package-lock.json ./

RUN npm install -g @angular/cli

RUN npm install

WORKDIR /usr/src/app

COPY . /usr/src/app

EXPOSE 4200

CMD ["ng","serve","--host", "0.0.0.0"]