# Use official node image as the base image
FROM node:alpine3.21

# Combine apk commands to reduce layers and improve caching
RUN apk --no-cache add git vim bash openssh gnupg libxml2-utils jq

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Set the environment variable for Node environment
ENV NODE_ENV=production

# Clear npm cache before installing dependencies
RUN npm cache clean --force && npm install

# Expose port 3000
EXPOSE 3000

# Start the Node.js server
CMD ["node", "server.js"]
