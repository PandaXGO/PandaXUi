FROM nginx:1.25-alpine
LABEL MAINTAINER="PandaX"

COPY deploy/default.conf /etc/nginx/conf.d/default.conf
COPY deploy/dist /usr/share/nginx/html/

#暴露容器8001端口
EXPOSE 7789
