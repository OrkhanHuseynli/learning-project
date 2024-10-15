FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json ./

RUN npm update && npm install

COPY prisma ./prisma

RUN echo Hello, it is me!
RUN ls

CMD npx prisma migrate deploy