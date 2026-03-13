-- GoBudget schema (auth + per-user budget state)

create table if not exists public.budgets (
  user_id uuid primary key references auth.users (id) on delete cascade,
  primary_salary numeric not null default 0,
  other_income numeric not null default 0,
  expenses jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.budgets enable row level security;

do $$ begin
  create policy "budgets_select_own" on public.budgets
    for select
    using (auth.uid() = user_id);
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create policy "budgets_insert_own" on public.budgets
    for insert
    with check (auth.uid() = user_id);
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create policy "budgets_update_own" on public.budgets
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
exception
  when duplicate_object then null;
end $$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists budgets_touch_updated_at on public.budgets;
create trigger budgets_touch_updated_at
before update on public.budgets
for each row
execute function public.touch_updated_at();
