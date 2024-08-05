FROM node:21-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3002

CMD ["npm", "start"]