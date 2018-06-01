FROM node:boron

# Create app directory
WORKDIR /app

# Install app dependencies
RUN npm install --global nodemon

# For npm@5 or later, copy package-lock.json as well
COPY package.json .
RUN npm install
RUN npm install nodemailer --save
COPY . .

# If you are building your code for production
# RUN npm install --only=production

EXPOSE 3000
CMD ["npm", "start"]

# discomment this line to run server in dev mode to allow automatic refresh
#CMD ["npm", "run", "startDev"]
