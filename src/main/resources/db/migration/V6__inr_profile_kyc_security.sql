ALTER TABLE wallets
    ALTER COLUMN currency SET DEFAULT 'INR';

UPDATE wallets
SET currency = 'INR'
WHERE currency IS DISTINCT FROM 'INR';

ALTER TABLE wallets
    DROP CONSTRAINT IF EXISTS chk_wallets_currency_inr;

ALTER TABLE wallets
    ADD CONSTRAINT chk_wallets_currency_inr CHECK (currency = 'INR');

UPDATE transactions
SET currency = 'INR'
WHERE currency IS DISTINCT FROM 'INR';

ALTER TABLE transactions
    DROP CONSTRAINT IF EXISTS chk_transactions_currency_inr;

ALTER TABLE transactions
    ADD CONSTRAINT chk_transactions_currency_inr CHECK (currency = 'INR');

ALTER TABLE users
    ADD COLUMN full_name VARCHAR(100),
    ADD COLUMN profile_image_url VARCHAR(255),
    ADD COLUMN two_factor_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN preference_email_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN preference_transfer_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN kyc_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    ADD COLUMN kyc_document_type VARCHAR(20),
    ADD COLUMN kyc_document_url VARCHAR(255),
    ADD COLUMN last_password_changed_at TIMESTAMPTZ;

UPDATE users
SET full_name = username
WHERE full_name IS NULL OR BTRIM(full_name) = '';

ALTER TABLE users
    ALTER COLUMN full_name SET NOT NULL;

ALTER TABLE users
    DROP CONSTRAINT IF EXISTS chk_users_kyc_status;

ALTER TABLE users
    ADD CONSTRAINT chk_users_kyc_status CHECK (kyc_status IN ('PENDING', 'VERIFIED', 'REJECTED'));
