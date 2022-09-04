CREATE TABLE day_weather (
    id serial PRIMARY KEY,
    date date NOT NULL,
    lat float NOT NULL,
    lng float NOT NULL,
    address varchar(255) NOT NULL,
    temp_max float NOT NULL,
    temp_min float NOT NULL,
    temp float NOT NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL
);