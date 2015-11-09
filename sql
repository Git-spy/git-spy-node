CREATE TABLE device (
  "id" SERIAL PRIMARY KEY
);

CREATE TABLE repository (
  "id" SERIAL PRIMARY KEY,
  "user_id" varchar(50),
  "name" varchar(50),
  "stars" integer
);