### STAGE 1: Build ###
FROM 166274191221.dkr.ecr.ap-south-1.amazonaws.com/aieze-node:12.22 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN node --max_old_space_size=10240 ./node_modules/@angular/cli/bin/ng build --configuration=dev

### STAGE 2: Run ###
FROM 166274191221.dkr.ecr.ap-south-1.amazonaws.com/aieze-nginx:1.17.1-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/init-frontend-admin /usr/share/nginx/html
RUN chmod -R 777 /usr/share/nginx/html
EXPOSE 83
CMD ["nginx", "-g", "daemon off;"]

