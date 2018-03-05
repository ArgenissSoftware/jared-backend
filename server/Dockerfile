FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
RUN npm install --global nodemon

# For npm@5 or later, copy package-lock.json as well
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

# If you are building your code for production
# RUN npm install --only=production

EXPOSE 3000
CMD ["npm", "start"]

# discomment this line to run server in dev mode to allow automatic refresh
# CMD ["npm", "run", "startDev"]
