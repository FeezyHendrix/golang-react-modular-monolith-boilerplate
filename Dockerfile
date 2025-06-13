FROM golang:1.24-alpine AS build-server

ARG COMMIT_HASH="n/a"

WORKDIR /app

COPY . .

EXPOSE 80 443

RUN go build -ldflags="-X 'main.Version=${COMMIT_HASH}'" -o insightone-powerhouse

FROM alpine

COPY --from=build-server /app/insightone-powerhouse /bin/insightone-powerhouse

RUN mkdir -p /html

RUN apk add --no-cache tzdata

COPY --from=build-server /app/spa/build /html/

ENTRYPOINT [ "insightone-server" ]
