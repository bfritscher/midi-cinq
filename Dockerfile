FROM node:18-slim

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --omit=dev

COPY . ./

# Run the web service on container startup.
CMD [ "node", "index.js" ]
