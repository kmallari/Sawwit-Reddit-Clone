# base image
FROM node:16.15.0

# Create a directory where our app will be placed
RUN mkdir -p /app

# set working directory
WORKDIR /app
# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli

# add app
COPY . /app

# start app
CMD ng serve --host 0.0.0.0