FROM node:8

WORKDIR /app

COPY package.json .
COPY yarn.lock .

COPY server .

RUN yarn

EXPOSE 8081
CMD [ "npm", "start" ]
