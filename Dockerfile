FROM node:alpine3.18

WORKDIR /usr/src/app

COPY . ./ 

RUN yarn install && yarn db:generate && yarn build 

CMD [ "yarn", "start" ]