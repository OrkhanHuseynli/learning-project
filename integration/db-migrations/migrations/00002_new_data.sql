-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS app.human
(
    id           serial primary key,
    app_user         app.user null,
    race         varchar(300)    not null
    );
-- +goose StatementEnd

