FROM node:latest

RUN mkdir -p /usr/src/app
ENV PORT 6789

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN yarn install --production

COPY . /usr/src/app

EXPOSE 6789
CMD [ "npm", "start" ]