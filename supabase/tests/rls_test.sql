-- Security and sync-behaviour tests for supabase/migrations/0001_init.sql.
-- Run with: npm run test:db   (needs a local PostgreSQL server)
\set ON_ERROR_STOP 1
set client_min_messages = notice;

create schema test;
create function test.check(ok boolean, what text) returns void
language plpgsql as $$
begin
  if ok is not true then
    raise exception 'TEST FAILED: %', what;
  end if;
  raise notice 'ok - %', what;
end $$;
grant usage on schema test to anon, authenticated;
grant execute on function test.check(boolean, text) to anon, authenticated;

-- Two users signing up with Google
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'alice@example.com',
   '{"full_name": "Alice Example", "avatar_url": "https://example.com/a.png"}'),
  ('00000000-0000-0000-0000-00000000000b', 'bob@example.com', '{}');

select test.check((select display_name from public.profiles where id = '00000000-0000-0000-0000-00000000000a') = 'Alice Example',
                  'signup creates profile from Google name');
select test.check((select display_name from public.profiles where id = '00000000-0000-0000-0000-00000000000b') = 'bob',
                  'signup falls back to email prefix');
select test.check((select count(*) from public.categories where user_id = '00000000-0000-0000-0000-00000000000a') = 17,
                  'signup seeds 17 default categories');

-- A subscription written by the trusted backend
insert into public.subscriptions (id, plan, provider) values
  ('00000000-0000-0000-0000-00000000000a', 'premium', 'google_play');

-- ------------------------------------------------------------------
-- Anonymous callers get nothing
-- ------------------------------------------------------------------
set role anon;
do $$ begin
  perform 1 from public.transactions;
  raise exception 'TEST FAILED: anon can read transactions';
exception when insufficient_privilege then raise notice 'ok - anon cannot read';
end $$;
do $$ begin
  perform public.delete_account();
  raise exception 'TEST FAILED: anon can call delete_account';
exception when insufficient_privilege then raise notice 'ok - anon cannot delete accounts';
end $$;
reset role;

-- ------------------------------------------------------------------
-- Alice
-- ------------------------------------------------------------------
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);

select test.check((select count(*) from public.categories) = 17, 'alice only sees her own categories');
select test.check((select count(*) from public.profiles) = 1, 'alice only sees her own profile');
select test.check((select plan from public.subscriptions) = 'premium', 'alice can read her subscription');

do $$ begin
  update public.subscriptions set plan = 'premium';
  raise exception 'TEST FAILED: alice can modify her subscription';
exception when insufficient_privilege then raise notice 'ok - subscriptions are read-only';
end $$;

-- Offline-created rows use client-side ids
insert into public.goals (id, user_id, name, target_amount)
values ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000a', 'Tatil', 20000);
insert into public.saving_templates (id, user_id, name, amount, frequency)
values ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000a', 'Kahve almadım', 45, 'daily');
insert into public.transactions (id, user_id, kind, amount, title, occurred_on, template_id, goal_id)
values ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000000a', 'saving', 45, 'Kahve almadım',
        '2026-09-24', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001');
insert into public.transactions (id, user_id, kind, amount, title, occurred_on, category_id)
select '30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000000a', 'spending', 120.5, 'Migros',
       '2026-09-24', id from public.categories where name = 'Market';
select test.check((select count(*) from public.transactions) = 2, 'alice can insert her own transactions');

do $$ begin
  insert into public.transactions (user_id, kind, amount, occurred_on)
  values ('00000000-0000-0000-0000-00000000000b', 'spending', 10, current_date);
  raise exception 'TEST FAILED: alice inserted a row for bob';
exception when insufficient_privilege then raise notice 'ok - cannot insert rows for another user';
end $$;

do $$ begin
  delete from public.transactions;
  raise exception 'TEST FAILED: alice can hard-delete';
exception when insufficient_privilege then raise notice 'ok - hard delete is not allowed';
end $$;

do $$ begin
  insert into public.transactions (user_id, kind, amount, occurred_on, category_id)
  values ('00000000-0000-0000-0000-00000000000a', 'saving', 10, current_date,
          (select id from public.categories limit 1));
  raise exception 'TEST FAILED: saving with category accepted';
exception when check_violation then raise notice 'ok - saving cannot have a category';
end $$;

do $$ begin
  insert into public.transactions (user_id, kind, amount, occurred_on, goal_id)
  values ('00000000-0000-0000-0000-00000000000a', 'spending', 10, current_date, '10000000-0000-0000-0000-000000000001');
  raise exception 'TEST FAILED: spending with goal accepted';
exception when check_violation then raise notice 'ok - spending cannot have a goal';
end $$;

do $$ begin
  insert into public.transactions (user_id, kind, amount, occurred_on)
  values ('00000000-0000-0000-0000-00000000000a', 'income', 0, current_date);
  raise exception 'TEST FAILED: zero amount accepted';
exception when check_violation then raise notice 'ok - amount must be positive';
end $$;

-- ---- last-write-wins ----------------------------------------------
select server_updated_at as before_cursor
from public.transactions where id = '30000000-0000-0000-0000-000000000002' \gset

update public.transactions set amount = 200, updated_at = now() + interval '1 second'
where id = '30000000-0000-0000-0000-000000000002';
select test.check((select amount from public.transactions where id = '30000000-0000-0000-0000-000000000002') = 200,
                  'newer write is applied');
select test.check((select server_updated_at from public.transactions where id = '30000000-0000-0000-0000-000000000002') > :'before_cursor',
                  'server cursor advances on write');

-- An offline device pushes an older edit via upsert: the newer row wins and
-- the canonical row is returned to the client.
with pushed as (
  insert into public.transactions (id, user_id, kind, amount, occurred_on, updated_at)
  values ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000000a', 'spending', 999,
          '2026-09-24', now() - interval '1 day')
  on conflict (id) do update set amount = excluded.amount, updated_at = excluded.updated_at
  returning amount
)
select test.check((select amount from pushed) = 200, 'stale upsert returns the newer server row');
select test.check((select amount from public.transactions where id = '30000000-0000-0000-0000-000000000002') = 200,
                  'stale write is ignored');

update public.transactions set updated_at = now() + interval '10 days'
where id = '30000000-0000-0000-0000-000000000001';
select test.check((select updated_at from public.transactions where id = '30000000-0000-0000-0000-000000000001') <= now() + interval '5 minutes',
                  'future client clocks are clamped');

update public.transactions set created_at = '2000-01-01', updated_at = now() + interval '2 seconds'
where id = '30000000-0000-0000-0000-000000000001';
select test.check((select created_at from public.transactions where id = '30000000-0000-0000-0000-000000000001') > '2020-01-01',
                  'created_at is immutable');

-- Soft delete
update public.transactions set deleted_at = now(), updated_at = now() + interval '3 seconds'
where id = '30000000-0000-0000-0000-000000000001';
select test.check((select deleted_at is not null from public.transactions where id = '30000000-0000-0000-0000-000000000001'),
                  'soft delete is stored as a tombstone');

reset role;

-- ------------------------------------------------------------------
-- Bob
-- ------------------------------------------------------------------
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);

select test.check((select count(*) from public.transactions) = 0, 'bob cannot see alice''s transactions');
select test.check((select count(*) from public.goals) = 0, 'bob cannot see alice''s goals');
select test.check((select count(*) from public.subscriptions) = 0, 'bob cannot see alice''s subscription');

update public.transactions set amount = 1 where id = '30000000-0000-0000-0000-000000000002';
reset role;
select test.check((select amount from public.transactions where id = '30000000-0000-0000-0000-000000000002') = 200,
                  'bob cannot update alice''s rows');
set role authenticated;

do $$ begin
  insert into public.transactions (id, user_id, kind, amount, occurred_on)
  values ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000000b', 'spending', 1, current_date)
  on conflict (id) do update set amount = excluded.amount;
  raise exception 'TEST FAILED: bob overwrote alice''s row via upsert';
exception when insufficient_privilege then raise notice 'ok - upsert cannot take over another user''s row';
end $$;

do $$ begin
  insert into public.transactions (user_id, kind, amount, occurred_on, category_id)
  select '00000000-0000-0000-0000-00000000000b', 'spending', 10, current_date, c.id
  from public.categories c limit 0;  -- bob cannot even select alice's ids
  insert into public.transactions (user_id, kind, amount, occurred_on, goal_id)
  values ('00000000-0000-0000-0000-00000000000b', 'saving', 10, current_date, '10000000-0000-0000-0000-000000000001');
  raise exception 'TEST FAILED: bob referenced alice''s goal';
exception when foreign_key_violation then raise notice 'ok - cannot reference another user''s goal';
end $$;

reset role;

-- ------------------------------------------------------------------
-- Account deletion
-- ------------------------------------------------------------------
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
select public.delete_account();
reset role;

select test.check((select count(*) from auth.users where id = '00000000-0000-0000-0000-00000000000a') = 0,
                  'delete_account removes the auth user');
select test.check((select count(*) from public.transactions) = 0
                  and (select count(*) from public.categories where user_id = '00000000-0000-0000-0000-00000000000a') = 0
                  and (select count(*) from public.subscriptions) = 0,
                  'delete_account removes all of the user''s data');
select test.check((select count(*) from public.categories where user_id = '00000000-0000-0000-0000-00000000000b') = 17,
                  'other users are untouched');

\warn 'ALL DATABASE TESTS PASSED'
