import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from env or local storage override
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('safeher_supabase_url') : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('safeher_supabase_key') : null;

  return {
    url: storedUrl || envUrl,
    key: storedKey || envKey,
  };
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    return null;
  }
  if (!clientInstance) {
    try {
      clientInstance = createClient(url, key);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return clientInstance;
};

export const resetSupabaseClient = () => {
  clientInstance = null;
};

// SQL Schema definition for BS IT University Project demonstration
export const SUPABASE_SQL_SCHEMA = `-- SafeHer: Women Safety & Emergency SOS Platform
-- Database Schema with Row Level Security (RLS) for Supabase PostgreSQL

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  phone text,
  role text default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  blood_type text,
  emergency_notes text,
  address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- Profiles RLS: Users can read and update their own profile; admins can read all
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 2. TRUSTED CONTACTS TABLE
create table if not exists public.trusted_contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  relationship text not null,
  phone text not null,
  email text,
  preferred_method text default 'SMS' check (preferred_method in ('SMS', 'Call', 'WhatsApp', 'Email')),
  is_primary boolean default false,
  can_receive_alerts boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.trusted_contacts enable row level security;

create policy "Users can manage own contacts"
  on public.trusted_contacts for all
  using (auth.uid() = user_id);

-- 3. SOS EVENTS TABLE
create table if not exists public.sos_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  user_name text not null,
  activated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_at timestamp with time zone,
  status text default 'active' check (status in ('active', 'resolved', 'cancelled', 'test')),
  latitude double precision,
  longitude double precision,
  accuracy double precision,
  address text,
  is_demo boolean default true,
  notes text,
  deliveries jsonb default '[]'::jsonb
);

alter table public.sos_events enable row level security;

create policy "Users can view own SOS events"
  on public.sos_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own SOS events"
  on public.sos_events for insert
  with check (auth.uid() = user_id);

create policy "Users can update own SOS events"
  on public.sos_events for update
  using (auth.uid() = user_id);

create policy "Admins can view all SOS events"
  on public.sos_events for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 4. SAFE JOURNEYS TABLE
create table if not exists public.safe_journeys (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  destination text not null,
  start_location text not null,
  start_time timestamp with time zone default timezone('utc'::text, now()) not null,
  expected_arrival_time timestamp with time zone not null,
  status text default 'Active' check (status in ('Planned', 'Active', 'Check-in Due', 'Completed', 'Cancelled')),
  selected_contact_ids jsonb default '[]'::jsonb,
  check_in_interval_minutes integer default 30,
  last_check_in_at timestamp with time zone,
  next_check_in_due timestamp with time zone,
  check_in_count integer default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.safe_journeys enable row level security;

create policy "Users can manage own journeys"
  on public.safe_journeys for all
  using (auth.uid() = user_id);

-- 5. INCIDENT REPORTS TABLE
create table if not exists public.incident_reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  reporter_name text,
  is_anonymous boolean default false,
  incident_type text not null,
  severity text not null check (severity in ('Low', 'Medium', 'High', 'Critical')),
  status text default 'Under Review' check (status in ('Under Review', 'Verified', 'Resolved', 'Dismissed')),
  location_name text not null,
  latitude double precision,
  longitude double precision,
  occurred_at timestamp with time zone not null,
  description text not null,
  image_url text,
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.incident_reports enable row level security;

-- Community can view verified/un-dismissed incidents
create policy "Anyone authenticated can view incidents"
  on public.incident_reports for select
  using (auth.role() = 'authenticated');

create policy "Users can insert own reports"
  on public.incident_reports for insert
  with check (auth.uid() = user_id);

create policy "Admins can update incident reports"
  on public.incident_reports for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 6. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text not null,
  read boolean default false,
  severity text default 'normal',
  action_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for all
  using (auth.uid() = user_id);
`;
