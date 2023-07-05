FROM 166274191221.dkr.ecr.ap-south-1.amazonaws.com/aieze-node:15.14.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY init-micro-common ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm install

EXPOSE 9003
CMD [ "npm", "start" ]
