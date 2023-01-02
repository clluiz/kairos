ALTER TABLE main.scheduling ADD COLUMN professional_id INTEGER REFERENCES main.professional(id);
ALTER TABLE main.user DROP COLUMN is_admin;