FROM node:11
COPY . /server
WORKDIR /server
EXPOSE 8181
CMD [ "npm", "start" ]
