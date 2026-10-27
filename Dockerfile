FROM php:8.3-cli-alpine

WORKDIR /var/www/html
COPY . /var/www/html

ENV MC_PRIVATE_DIR=/var/data/accounts
EXPOSE 10000

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-10000} -t /var/www/html"]
