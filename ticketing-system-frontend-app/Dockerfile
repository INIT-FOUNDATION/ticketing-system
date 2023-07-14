### STAGE 1: Build ###
FROM node AS build
WORKDIR /usr/src/app
COPY package*.json ./
# RUN npm install -g ionic
RUN npm install --force
COPY . .
# RUN npm run build -- --configuration dev
RUN node --max_old_space_size=10240 ./node_modules/@angular/cli/bin/ng build --configuration=dev

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/www /usr/share/nginx/html
RUN chmod -R 777 /usr/share/nginx/html
EXPOSE 83
CMD ["nginx", "-g", "daemon off;"]

