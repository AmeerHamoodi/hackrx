FROM node:14

WORKDIR /var/www
COPY package.json yarn.lock /var/www/

RUN yarn install

COPY . .

EXPOSE 3000
CMD yarn start:dev