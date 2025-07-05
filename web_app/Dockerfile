FROM nginx:alpine

MAINTAINER <ayuanlmo@outlook.com>

RUN rm /etc/nginx/conf.d/default.conf

ADD /nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY ./build /usr/share/nginx/html

EXPOSE 80
