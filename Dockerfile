FROM node:17.0.1
WORKDIR /jobb
COPY package.json /jobb/
RUN npm install
COPY . /jobb
CMD ["node" , "server.js" ]