FROM redis:latest
LABEL maintainer="Min (hotro.min-services@gmail.com)"
COPY .docker/redis/redis.conf /usr/local/etc/redis/redis.conf
CMD ["redis-server", "--include /usr/local/etc/redis/redis.conf"]
