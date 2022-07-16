FROM node:alpine

RUN mkdir -p /usr/src/app
ENV PORT 3001

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

# Production use node instead of root
# USER node

RUN yarn install --production

COPY . /usr/src/app

# RUN yarn build
# uncomment for prod

EXPOSE 3001
CMD [ "yarn", "dev" ]
# make dev -> start for prod