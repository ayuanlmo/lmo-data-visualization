FROM node:20-alpine

LABEL maintainer="ayuanlmo@outlook.com"

WORKDIR /lmo-app/server

COPY . .

RUN apk add --no-cache yarn

RUN npm i -g pm2
RUN npm i -g gulp
RUN yarn
RUN yarn prod

RUN chmod +x /lmo-app/server/dist/main.js

CMD ["pm2-runtime", "start", "/lmo-app/server/dist/main.js", \
     "--interpreter", "node"]
EXPOSE 3000
