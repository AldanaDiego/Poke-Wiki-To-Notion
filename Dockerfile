FROM node:19.5.0-alpine3.16
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY ./app.js .
COPY ./src ./
EXPOSE 3000
CMD ["npm", "run", "dev"]