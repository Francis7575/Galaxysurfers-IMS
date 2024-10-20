FROM node:21.7.3

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]