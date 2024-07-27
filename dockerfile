FROM node:latest 
WORKDIR /app
ADD . .
RUN npm install
RUN npm install pm2 -g
RUN npm install -g @angular/cli
RUN ng build
CMD ["pm2-runtime", "server2.js"]