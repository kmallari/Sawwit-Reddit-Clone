# base image (all dockerfiles should have this)
FROM node:12.2.0
 
# set working directory
WORKDIR /app
 
### install and cache app dependencies
 
# copy package.json & package-lock.json to ./ inside the Docker image
COPY package*.json ./
 
# install dependencies of the app
RUN npm install

# install dependencies for start.sh
RUN apt-get update && apt-get install -y netcat
 
# copy the source code to the Docker image
COPY . .
 
# expose the port where the app will listen to
EXPOSE 8080
 
# start the server
CMD ["npm", "start"]