FROM node:20

WORKDIR ./

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 2543

CMD ["node", "index.js"]