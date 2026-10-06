CREATE TABLE IF NOT EXISTS orders (
  reference text PRIMARY KEY NOT NULL,
  email text NOT NULL,
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  address jsonb NOT NULL,
  delivery_method text NOT NULL,
  items jsonb NOT NULL,
  subtotal_pence integer NOT NULL,
  delivery_pence integer NOT NULL,
  total_pence integer NOT NULL,
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'requested',
  created_at text NOT NULL
);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at);
