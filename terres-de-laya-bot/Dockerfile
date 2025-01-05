# Stage 1: Build stage with Debian
FROM node:16-bullseye as builder

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install

# Stage 2: Runtime stage with Alpine
FROM node:alpine3.21

RUN apk --no-cache add bash

WORKDIR /usr/local/app

# Copy built application from builder stage
COPY --from=builder /usr/local/app /usr/local/app

EXPOSE 3000

CMD ["node", "server.js"]