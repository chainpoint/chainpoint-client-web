FROM node:carbon

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copy sources

COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "npx", "serve", "-s", "dist", "-port", "3000" ]
