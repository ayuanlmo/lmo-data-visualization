FROM node:18

LABEL maintainer="ayuanlmo@outlook.com"

WORKDIR /lmo-app/service

COPY package.json yarn.lock ./

RUN npm install -g typescript pm2 && \
    yarn install

COPY . .

RUN yarn c

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libnss3 \
        libglib2.0-0 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libxkbcommon0 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
        libgbm1 \
        libpango-1.0-0 \
        libcairo2 \
        libasound2 \
        fonts-wqy-microhei && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN fc-cache -f -v

RUN rm -rf \
    /lmo-app/service/node_modules/ffprobe-static/bin/darwin/ \
    /lmo-app/service/node_modules/ffprobe-static/bin/linux/ia32 \
    /lmo-app/service/node_modules/ffprobe-static/bin/win32/

RUN chmod +x /lmo-app/service/dist/main.js

CMD ["node", "--experimental-modules", "--es-module-specifier-resolution=node", "/lmo-app/service/dist/main.js"]

EXPOSE 3002
