FROM node:6.4

RUN npm install webpack -g

ENV NODE_ENV=production

WORKDIR /tmp
COPY package.json /tmp/
RUN npm install

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN cp -a /tmp/node_modules /usr/src/app/
RUN npm run build:client
