FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye
RUN apt-get -y update && apt-get -y install nginx
COPY nginx.conf /etc/nginx/
EXPOSE 8090