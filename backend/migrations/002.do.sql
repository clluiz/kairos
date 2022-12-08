CREATE TABLE IF NOT EXISTS main.tenant (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT NULL
);

CREATE TABLE IF NOT EXISTS main.user (
  id INTEGER PRIMARY KEY,
  login TEXT NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL default false
);

CREATE TABLE IF NOT EXISTS main.customer (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  telefone VARCHAR(13) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES main.user(id)
);

CREATE TABLE IF NOT EXISTS main.professional (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone VARCHAR(13) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES main.user(id),
  tenant_id INTEGER REFERENCES main.tenant(id) 
);

CREATE TABLE IF NOT EXISTS main.address (
  id INTEGER PRIMARY KEY,
  public_area VARCHAR NOT NULL,
  number VARCHAR(5) NULL,
  city TEXT NOT NULL,
  state VARCHAR(2) NOT NULL,
  country TEXT NOT NULL,
  zip_code TEXT NULL,
  complement TEXT NULL
);

CREATE TABLE IF NOT EXISTS main.place (
  id INTEGER PRIMARY KEY,
  address_id INTEGER REFERENCES main.address(id) NOT NULL,
  tenant_id INTEGER REFERENCES main.tenant(id)
);

CREATE TABLE IF NOT EXISTS main.scheduling (
  id INTEGER PRIMARY KEY,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  day DATE NOT NULL,
  description TEXT,
  place_id INTEGER REFERENCES main.place(id) NOT NULL
);
