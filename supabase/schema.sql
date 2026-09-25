-- Run this once in the Supabase SQL Editor before connecting the live app.
create type public.user_role as enum ('driver', 'passenger');
create type public.booking_status as enum ('requested', 'accepted', 'en_route', 'completed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  full_name text not null check (char_length(full_name) >= 2),
  phone text,
  vehicle_details text,
  is_available boolean not null default false,
  pickup_lat double precision,
  pickup_lng double precision,
  pickup_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.driver_locations (
  driver_id uuid primary key references public.profiles(id) on delete cascade,
  latitude double precision not null,
  longitude double precision not null,
  heading double precision,
  updated_at timestamptz not null default now(),
  sharing_until timestamptz not null
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  passenger_id uuid not null references public.profiles(id) on delete cascade,
  driver_id uuid not null references public.profiles(id) on delete restrict,
  pickup_label text not null,
  pickup_lat double precision,
  pickup_lng double precision,
  dropoff_label text not null,
  scheduled_for timestamptz not null,
  passenger_count integer not null default 1 check (passenger_count between 1 and 8),
  status public.booking_status not null default 'requested',
  driver_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_driver_schedule_idx on public.bookings(driver_id, scheduled_for);
create index bookings_passenger_schedule_idx on public.bookings(passenger_id, scheduled_for);
create index driver_locations_sharing_idx on public.driver_locations(sharing_until);

alter table public.profiles enable row level security;
alter table public.driver_locations enable row level security;
alter table public.bookings enable row level security;

revoke all on public.profiles, public.driver_locations, public.bookings from anon;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.driver_locations to authenticated;
grant select, insert, update on public.bookings to authenticated;

create policy "Users can view signed-in profiles" on public.profiles
  for select to authenticated using (true);
create policy "Users can create their own profile" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "Users can update their own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Drivers manage their own location" on public.driver_locations
  for insert to authenticated with check ((select auth.uid()) = driver_id);
create policy "Drivers update their own location" on public.driver_locations
  for update to authenticated using ((select auth.uid()) = driver_id) with check ((select auth.uid()) = driver_id);
create policy "Relevant riders can view driver locations" on public.driver_locations
  for select to authenticated using (
    (select auth.uid()) = driver_id
    or exists (
      select 1 from public.bookings
      where bookings.driver_id = driver_locations.driver_id
        and bookings.passenger_id = (select auth.uid())
        and bookings.status in ('accepted', 'en_route')
    )
  );

create policy "Passengers create their own bookings" on public.bookings
  for insert to authenticated with check ((select auth.uid()) = passenger_id);
create policy "Passengers and drivers view their bookings" on public.bookings
  for select to authenticated using ((select auth.uid()) = passenger_id or (select auth.uid()) = driver_id);
create policy "Drivers update assigned bookings" on public.bookings
  for update to authenticated using ((select auth.uid()) = driver_id) with check ((select auth.uid()) = driver_id);
create policy "Passengers cancel their requested bookings" on public.bookings
  for update to authenticated using ((select auth.uid()) = passenger_id and status = 'requested') with check ((select auth.uid()) = passenger_id);

alter publication supabase_realtime add table public.driver_locations, public.bookings;
