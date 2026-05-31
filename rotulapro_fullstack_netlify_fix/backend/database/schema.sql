create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  password_hash text not null,
  requested_role text check (requested_role in ('admin','rotulador','superadmin')),
  role text check (role in ('superadmin','admin','rotulador')),
  status text not null default 'pending' check (status in ('pending','approved','rejected','disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists settings (
  id int primary key default 1,
  euro_bcv_rate numeric(12,4) not null default 610,
  default_margin numeric(5,4) not null default 0.40,
  waste_margin_cm int not null default 10,
  design_base_cost numeric(12,2) not null default 35,
  install_base_cost numeric(12,2) not null default 30,
  minimum_sale numeric(12,2) not null default 25,
  updated_at timestamptz not null default now(),
  constraint one_row check (id = 1)
);

create table if not exists materials (
  id text primary key,
  name text not null,
  cost_per_m2 numeric(12,2) not null,
  sale_per_m2 numeric(12,2) not null,
  updated_at timestamptz not null default now()
);

create table if not exists exchange_rates (
  id uuid primary key default gen_random_uuid(),
  currency text not null,
  rate numeric(12,4) not null,
  source text,
  fetched_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_phone text not null,
  business_name text,
  sale_type text not null,
  material_id text references materials(id),
  total_m2 numeric(12,4) not null default 0,
  internal_cost numeric(12,2) not null default 0,
  price_usd numeric(12,2) not null default 0,
  price_bs numeric(14,2) not null default 0,
  deposit_usd numeric(12,2) not null default 0,
  balance_usd numeric(12,2) not null default 0,
  profit numeric(12,2) not null default 0,
  status text not null default 'Cotización creada',
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references quotes(id) on delete cascade,
  name text not null,
  base_w numeric(10,2) not null,
  base_h numeric(10,2) not null,
  final_w numeric(10,2) not null,
  final_h numeric(10,2) not null,
  quantity int not null default 1,
  area_m2 numeric(12,4) not null,
  source text not null default 'manual',
  confidence text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references quotes(id),
  client_name text not null,
  client_phone text not null,
  sale_type text not null,
  total_m2 numeric(12,4) not null default 0,
  internal_cost numeric(12,2) not null default 0,
  price_usd numeric(12,2) not null default 0,
  price_bs numeric(14,2) not null default 0,
  deposit_usd numeric(12,2) not null default 0,
  balance_usd numeric(12,2) not null default 0,
  status text not null default 'Venta registrada',
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into settings (id) values (1) on conflict (id) do nothing;

insert into materials (id, name, cost_per_m2, sale_per_m2) values
('vinil_laminado','Vinil laminado',16,32),
('sticker','Sticker',12,28),
('microperforado','Microperforado',18,38),
('vinil_corte','Vinil de corte',14,34),
('pvc_vinil','PVC + vinil',20,45)
on conflict (id) do nothing;

-- Usuario inicial. Cambia la clave después de entrar.
-- Correo: Yeiroa2003@gmail.com
-- Clave temporal: admin123
-- Hash bcrypt generado para admin123.
insert into users (name,email,phone,password_hash,requested_role,role,status)
values ('Dueño RotulaPro','Yeiroa2003@gmail.com','', '$2a$12$2gm.JD8JH91Fi6IQ4gb28eU4o1LEutDp1rto5s/avGcY5QGfNQmeC','superadmin','superadmin','approved')
on conflict (email) do nothing;
