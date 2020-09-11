FROM node

# set working directory for webapp
WORKDIR /home/node/app

# install packages in container from package.json
COPY package*.json ./
RUN npm install

# copy the rest of the app files
COPY . .

# expose port 80
EXPOSE 80

# run the app with node
CMD ["node", "app.js"]
