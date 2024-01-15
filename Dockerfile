FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# Copy the rest of the application code
COPY . .
CMD [ "node", "app.js" ]