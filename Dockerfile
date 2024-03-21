# Dockerfile

# pull official base image
FROM node:alpine as  builder

# set work directory
WORKDIR /app

#Copy app dependencies
COPY package*.json ./

# Install Node.js and npm
RUN apk add --update npm
# RUN npm install -g @angular/cli
# install dependencies
RUN npm install

COPY . .


CMD ["ng", "serve", "--host 0.0.0.0"]
# CMD ["npm", "start"]
# Build app
# RUN npm run build --prefix ficc_front --output-path=./dist/out

# CMD ["runserver", "0.0.0.0:8000"]
