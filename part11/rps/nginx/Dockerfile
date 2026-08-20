FROM nginx:1.27.3-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf/prod.conf /etc/nginx/prod.conf
COPY conf/dev.conf  /etc/nginx/dev.conf

COPY init.sh /init.sh
RUN chmod +x /init.sh
RUN apk add --no-cache wget

EXPOSE 80 443

ENTRYPOINT ["/init.sh"]
