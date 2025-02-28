# Use Debian-based Node.js image
FROM node:16-bullseye

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install

# Expose port 3000
EXPOSE 3000

CMD ["node", "bot.js"]