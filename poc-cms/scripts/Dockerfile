FROM node:20

RUN mkdir /usr/app

WORKDIR /usr/app

COPY package*.json ./

RUN npm install
RUN npm install ts-node

COPY . /usr/app

CMD ["./node_modules/.bin/ts-node", "./scripts/index.ts"]