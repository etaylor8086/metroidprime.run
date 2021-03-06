CREATE TABLE records (
    id SERIAL PRIMARY KEY,
    categoryid INTEGER NOT NULL REFERENCES categories(id),
    playerid INTEGER NOT NULL REFERENCES users(id),
    realtime INTERVAL NULL, -- milliseconds
    gametime INTERVAL NULL, -- milliseconds
    escapetime INTERVAL NULL, -- milliseconds
    comment VARCHAR(500) NULL,
    videourl VARCHAR(100) NULL,
    date timestamp NOT NULL,
    submitted timestamp NOT NULL,
    submitterid INTEGER NULL REFERENCES users(id),
    hidden BOOLEAN DEFAULT FALSE,
    rejected BOOLEAN DEFAULT FALSE,
    rejectMsg VARCHAR(500) NULL
);
