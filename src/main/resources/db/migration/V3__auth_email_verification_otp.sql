-- Development reset requested for authentication upgrade
DELETE FROM transactions;
DELETE FROM wallets;
DELETE FROM users;

ALTER TABLE users
    ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN otp_code VARCHAR(16),
    ADD COLUMN otp_expiry TIMESTAMPTZ;
