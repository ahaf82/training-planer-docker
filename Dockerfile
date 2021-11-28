FROM node:lts-alpine

# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# WORKDIR /home/node/app
WORKDIR "/app"

COPY package*.json ./

# USER node

RUN yarn

COPY . .

# COPY --chown=node:node . .

EXPOSE 5050

CMD [ "nodemon" ]
