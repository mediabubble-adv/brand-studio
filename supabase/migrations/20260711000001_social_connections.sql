-- Add token storage fields to brand_profiles
alter table brand_profiles add column if not exists facebook_page_id text;
alter table brand_profiles add column if not exists facebook_access_token text;
alter table brand_profiles add column if not exists instagram_business_id text;
alter table brand_profiles add column if not exists google_ads_customer_id text;
alter table brand_profiles add column if not exists google_refresh_token text;

-- Create publish_logs audit table
create table if not exists publish_logs (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references posts(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'facebook', 'google_ads')),
  status text not null check (status in ('success', 'failed')),
  error_message text,
  payload jsonb default '{}',
  created_at timestamptz default now()
);

-- Enable RLS and setup policies
alter table publish_logs enable row level security;

create policy "MB team views logs" on publish_logs
  for select using (
    exists (
      select 1 from brand_memberships
      where user_id = auth.uid()
      and role in ('mb_owner','mb_pm','mb_designer','mb_copywriter')
    )
  );
