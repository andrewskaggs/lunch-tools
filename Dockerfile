FROM alpine:3.3

RUN apk add --update g++ make nodejs supervisor

RUN mkdir -p /app/client /app/server

COPY client /app/client

COPY server /app/server

COPY ./container/files /

COPY ./container/scripts /app/scripts
RUN /app/scripts/compile.sh

CMD ["supervisord", "-n", "-c", "/etc/supervisord.conf"]
