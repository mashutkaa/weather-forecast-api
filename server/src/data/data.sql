CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('hourly', 'daily')),
    token TEXT NOT NULL,
    confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

