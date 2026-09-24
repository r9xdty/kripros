-- =====================================================================
-- Kripros — initial schema
--
-- Run once in the Supabase dashboard (SQL Editor → New query → paste →
-- Run) or with `supabase db push`.
--
-- Design notes
--   * Every synced table carries:
--       updated_at         client clock, used for last-write-wins
--       server_updated_at  server clock, used as the pull cursor
--       deleted_at         soft delete (tombstone) so other devices learn
--                          about deletions; rows are never hard-deleted
--                          except when the whole account is deleted.
--   * Row level security guarantees a user only ever sees / writes rows
--     whose user_id is their own auth uid.
--   * Clients generate UUIDs themselves so records can be created offline.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Shared trigger: last-write-wins + server cursor
-- ---------------------------------------------------------------------
create or replace function public.kripros_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    -- An offline device may push an edit that is older than what the
    -- server already has. Keep the newer row; the client reads the
    -- canonical version back from the upsert response.
    if new.updated_at < old.updated_at then
      return old;
    end if;
    new.created_at := old.created_at;
  end if;

  -- Do not let a device with a clock far in the future win every conflict.
  if new.updated_at is null or new.updated_at > now() + interval '5 minutes' then
    new.updated_at := now();
  end if;

  new.server_updated_at := clock_timestamp();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- profiles (one row per user, created automatically on sign up)
-- ---------------------------------------------------------------------
create table public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  display_name      text check (char_length(display_name) <= 80),
  avatar_url        text check (char_length(avatar_url) <= 1000),
  currency          text not null default 'TRY' check (currency in ('TRY', 'USD', 'EUR', 'GBP')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  server_updated_at timestamptz not null default clock_timestamp()
);

-- ---------------------------------------------------------------------
-- categories (income / spending)
-- ---------------------------------------------------------------------
create table public.categories (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind              text not null check (kind in ('income', 'spending')),
  name              text not null check (char_length(name) between 1 and 40),
  icon              text not null default 'ellipsis-horizontal' check (char_length(icon) <= 40),
  color             text not null default '#6b7280' check (color ~ '^#[0-9a-fA-F]{6}$'),
  sort_order        integer not null default 0,
  is_default        boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz,
  server_updated_at timestamptz not null default clock_timestamp(),
  unique (id, user_id)
);

-- ---------------------------------------------------------------------
-- saving_templates ("Kahve almadım — 45 ₺ — günlük")
-- ---------------------------------------------------------------------
create table public.saving_templates (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name              text not null check (char_length(name) between 1 and 60),
  amount            numeric(12, 2) not null check (amount > 0),
  frequency         text not null default 'daily' check (frequency in ('daily', 'weekly', 'monthly', 'yearly')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz,
  server_updated_at timestamptz not null default clock_timestamp(),
  unique (id, user_id)
);

-- ---------------------------------------------------------------------
-- goals (birikim hedefleri)
-- ---------------------------------------------------------------------
create table public.goals (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name              text not null check (char_length(name) between 1 and 60),
  target_amount     numeric(14, 2) not null check (target_amount > 0),
  initial_amount    numeric(14, 2) not null default 0 check (initial_amount >= 0),
  target_date       date,
  icon              text not null default 'flag' check (char_length(icon) <= 40),
  color             text not null default '#10b981' check (color ~ '^#[0-9a-fA-F]{6}$'),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz,
  server_updated_at timestamptz not null default clock_timestamp(),
  unique (id, user_id)
);

-- ---------------------------------------------------------------------
-- transactions (gelir / harcama / birikim)
-- ---------------------------------------------------------------------
create table public.transactions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind              text not null check (kind in ('income', 'spending', 'saving')),
  amount            numeric(12, 2) not null check (amount > 0),
  title             text not null default '' check (char_length(title) <= 80),
  note              text check (char_length(note) <= 500),
  occurred_on       date not null,
  category_id       uuid,
  template_id       uuid,
  goal_id           uuid,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz,
  server_updated_at timestamptz not null default clock_timestamp(),

  -- Composite keys make it impossible to reference another user's rows.
  foreign key (category_id, user_id) references public.categories (id, user_id),
  foreign key (template_id, user_id) references public.saving_templates (id, user_id),
  foreign key (goal_id, user_id)     references public.goals (id, user_id),

  -- Categories belong to income/spending; templates and goals to savings.
  check (kind <> 'saving' or category_id is null),
  check (kind = 'saving' or (template_id is null and goal_id is null))
);

-- ---------------------------------------------------------------------
-- subscriptions (read-only for clients; written by a trusted backend
-- after verifying a Google Play / App Store purchase)
-- ---------------------------------------------------------------------
create table public.subscriptions (
  id                uuid primary key references auth.users (id) on delete cascade, -- = user id
  plan              text not null default 'free' check (plan in ('free', 'premium')),
  provider          text check (provider in ('google_play', 'app_store')),
  product_id        text,
  expires_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  server_updated_at timestamptz not null default clock_timestamp()
);

-- ---------------------------------------------------------------------
-- Indexes (pull cursor + common queries)
-- ---------------------------------------------------------------------
create index categories_sync_idx       on public.categories       (user_id, server_updated_at);
create index saving_templates_sync_idx on public.saving_templates (user_id, server_updated_at);
create index goals_sync_idx            on public.goals            (user_id, server_updated_at);
create index transactions_sync_idx     on public.transactions     (user_id, server_updated_at);
create index transactions_date_idx     on public.transactions     (user_id, occurred_on);

-- ---------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------
create trigger profiles_touch         before insert or update on public.profiles         for each row execute function public.kripros_touch();
create trigger categories_touch       before insert or update on public.categories       for each row execute function public.kripros_touch();
create trigger saving_templates_touch before insert or update on public.saving_templates for each row execute function public.kripros_touch();
create trigger goals_touch            before insert or update on public.goals            for each row execute function public.kripros_touch();
create trigger transactions_touch     before insert or update on public.transactions     for each row execute function public.kripros_touch();
create trigger subscriptions_touch    before insert or update on public.subscriptions    for each row execute function public.kripros_touch();

-- ---------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------
alter table public.profiles         enable row level security;
alter table public.categories       enable row level security;
alter table public.saving_templates enable row level security;
alter table public.goals            enable row level security;
alter table public.transactions     enable row level security;
alter table public.subscriptions    enable row level security;

create policy profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy profiles_insert on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy categories_select on public.categories for select to authenticated
  using (user_id = (select auth.uid()));
create policy categories_insert on public.categories for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy categories_update on public.categories for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy saving_templates_select on public.saving_templates for select to authenticated
  using (user_id = (select auth.uid()));
create policy saving_templates_insert on public.saving_templates for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy saving_templates_update on public.saving_templates for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy goals_select on public.goals for select to authenticated
  using (user_id = (select auth.uid()));
create policy goals_insert on public.goals for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy goals_update on public.goals for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy transactions_select on public.transactions for select to authenticated
  using (user_id = (select auth.uid()));
create policy transactions_insert on public.transactions for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy transactions_update on public.transactions for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy subscriptions_select on public.subscriptions for select to authenticated
  using (id = (select auth.uid()));

-- Clients never hard-delete and never talk to the API anonymously.
revoke all on public.profiles, public.categories, public.saving_templates,
              public.goals, public.transactions, public.subscriptions
  from anon, authenticated;
grant select, insert, update on public.profiles, public.categories, public.saving_templates,
                               public.goals, public.transactions
  to authenticated;
grant select on public.subscriptions to authenticated;

-- ---------------------------------------------------------------------
-- New user: profile + default categories
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name',
                  new.raw_user_meta_data ->> 'name',
                  split_part(new.email, '@', 1)), 80),
    left(coalesce(new.raw_user_meta_data ->> 'avatar_url',
                  new.raw_user_meta_data ->> 'picture'), 1000)
  )
  on conflict (id) do nothing;

  insert into public.categories (user_id, kind, name, icon, color, sort_order, is_default)
  select new.id, d.kind, d.name, d.icon, d.color, d.sort_order, true
  from (values
    ('spending', 'Market',       'cart',                '#ef4444',  1),
    ('spending', 'Yeme-İçme',    'restaurant',          '#f97316',  2),
    ('spending', 'Ulaşım',       'car',                 '#eab308',  3),
    ('spending', 'Faturalar',    'receipt',             '#06b6d4',  4),
    ('spending', 'Kira & Konut', 'home',                '#8b5cf6',  5),
    ('spending', 'Sağlık',       'medkit',              '#ec4899',  6),
    ('spending', 'Giyim',        'shirt',               '#a855f7',  7),
    ('spending', 'Eğlence',      'game-controller',     '#14b8a6',  8),
    ('spending', 'Eğitim',       'book',                '#3b82f6',  9),
    ('spending', 'Teknoloji',    'laptop',              '#6366f1', 10),
    ('spending', 'Abonelikler',  'repeat',              '#0ea5e9', 11),
    ('spending', 'Diğer',        'ellipsis-horizontal', '#6b7280', 12),
    ('income',   'Maaş',         'briefcase',           '#10b981',  1),
    ('income',   'Ek Gelir',     'trending-up',         '#22c55e',  2),
    ('income',   'Yatırım',      'stats-chart',         '#0ea5e9',  3),
    ('income',   'Hediye',       'gift',                '#f59e0b',  4),
    ('income',   'Diğer',        'ellipsis-horizontal', '#6b7280',  5)
  ) as d (kind, name, icon, color, sort_order);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Account deletion (required by Google Play / App Store policies).
-- Deleting the auth user cascades to every table above.
-- ---------------------------------------------------------------------
create or replace function public.delete_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_account() from public, anon;
grant execute on function public.delete_account() to authenticated;

revoke all on function public.handle_new_user() from public, anon, authenticated;
