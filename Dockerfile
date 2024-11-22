FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ 

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

RUN npm run build
RUN npm rebuild bcrypt --build-from-source

EXPOSE 3000

CMD ["node", "dist/index.js"]

