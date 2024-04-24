-- +goose Up
-- +goose StatementBegin
CREATE SCHEMA IF NOT EXISTS app;
-- +goose StatementEnd
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS app.user
(
    id           serial primary key,
    name         varchar(300)    not null,
    age          int    not null
);

INSERT INTO app.user(name, age)
VALUES ('Norman', 40);
-- +goose StatementEnd

