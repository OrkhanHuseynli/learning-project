#checkov:skip=CKV_DOCKER_2: ok
#checkov:skip=CKV2_DOCKER_3: ok
#checkov:skip=CKV_DOCKER_5: ok
#checkov:skip=CKV2_DOCKER_7: ok


FROM golang:1.18-alpine3.15 as build

WORKDIR /db-migrations

COPY go.mod ./
COPY go.sum ./
COPY main.go ./
COPY migrations migrations
COPY vendor vendor

RUN go build -mod=vendor -o /app/migrator

FROM alpine:3.17 as run

WORKDIR /app
COPY --from=build /app/migrator /app/migrator
COPY --from=build /db-migrations/migrations /app/migrations

ENTRYPOINT ["/app/migrator"]
