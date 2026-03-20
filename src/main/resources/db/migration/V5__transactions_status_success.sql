ALTER TABLE transactions
    DROP CONSTRAINT IF EXISTS chk_transactions_status;

ALTER TABLE transactions
    ADD CONSTRAINT chk_transactions_status CHECK (
        status IN ('PENDING', 'SUCCESS', 'FAILED', 'COMPLETED', 'CANCELLED')
    );