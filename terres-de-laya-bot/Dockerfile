# Use Debian-based Node.js image
FROM node:16-bullseye

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install

CMD ["node", "bot.js"]