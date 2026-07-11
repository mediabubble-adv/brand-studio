-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- BRANDS
-- ============================================================
create table brands (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  industry text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- BRAND PROFILES (1:1 with brands)
-- ============================================================
create table brand_profiles (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid not null references brands(id) on delete cascade unique,
  primary_color text,
  secondary_color text,
  accent_color text,
  bg_color text,
  font_header text,
  font_body text,
  font_accent text,
  languages text[] default '{}',
  dialects text[] default '{}',
  tone_keywords text[] default '{}',
  grid_strategy text check (grid_strategy in ('row-theme','alternating','checkerboard','color-block')),
  post_cadence jsonb default '{"feed":4,"stories":7,"reels":2}',
  instagram_handle text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- BRAND ASSETS
-- ============================================================
create table brand_assets (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  type text not null check (type in ('logo','logo_white','logo_dark','frame','watermark','pattern','background')),
  url text not null,
  format text,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- CLIENT DOMAINS (domain-based signup allowlist)
-- ============================================================
create table client_domains (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid not null references brands(id) on delete cascade,
  domain text not null,
  created_at timestamptz default now(),
  unique(brand_id, domain)
);

-- ============================================================
-- BRAND MEMBERSHIPS (users <-> brands)
-- ============================================================
create table brand_memberships (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  brand_id uuid not null references brands(id) on delete cascade,
  role text not null check (role in (
    'mb_owner','mb_pm','mb_designer','mb_copywriter',
    'client_admin','client_approver','client_member'
  )),
  invited_by uuid,
  joined_at timestamptz default now(),
  unique(user_id, brand_id)
);

-- ============================================================
-- POSTS
-- ============================================================
create table posts (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid not null references brands(id) on delete cascade,
  caption_ar text,
  caption_en text,
  hashtags_ar text[] default '{}',
  hashtags_en text[] default '{}',
  hooks_ar text[] default '{}',
  hooks_en text[] default '{}',
  image_prompt text,
  raw_image_url text,
  final_image_url text,
  grid_slot integer check (grid_slot >= 0 and grid_slot <= 8),
  canvas_config jsonb default '{}',
  format text not null default 'instagram_post_1080x1080',
  status text not null default 'draft' check (status in (
    'draft','composing','approved','scheduled','published'
  )),
  publish_at timestamptz,
  assigned_to uuid,
  created_at timestamptz default now(),
  approved_at timestamptz,
  published_at timestamptz
);

-- ============================================================
-- GRID PLANS
-- ============================================================
create table grid_plans (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  theme text,
  slots uuid[] default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- CAMPAIGNS
-- ============================================================
create table campaigns (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid not null references brands(id) on delete cascade,
  name text not null,
  goal text,
  start_date date,
  end_date date,
  status text default 'active' check (status in ('active','paused','completed')),
  created_at timestamptz default now()
);

-- ============================================================
-- BRIEFS
-- ============================================================
create table briefs (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  brand_id uuid not null references brands(id) on delete cascade,
  scheduled_date date,
  channel text not null check (channel in (
    'instagram_feed','instagram_story','instagram_reel',
    'facebook_post','facebook_story',
    'meta_ad','google_display','tiktok','linkedin'
  )),
  type text check (type in (
    'announcement','offer','event','product_launch',
    'engagement_question','testimonial','educational'
  )),
  topic text,
  tone_tags text[] default '{}',
  caption_ar text,
  caption_en text,
  hooks_ar text[] default '{}',
  hooks_en text[] default '{}',
  image_prompt text,
  format text,
  assigned_to uuid,
  post_id uuid references posts(id),
  status text not null default 'brief_draft' check (status in (
    'brief_draft','brief_reviewed','assets_generating','assets_ready',
    'composing','design_approved','scheduled','published'
  )),
  created_at timestamptz default now()
);

-- ============================================================
-- REPORTS
-- ============================================================
create table reports (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid not null references brands(id) on delete cascade,
  month integer not null check (month >= 1 and month <= 12),
  year integer not null,
  metrics_snapshot jsonb default '{}',
  pm_notes text,
  status text not null default 'generating' check (status in (
    'generating','ready','approved','sent'
  )),
  approved_by uuid,
  approved_at timestamptz,
  sent_at timestamptz,
  client_email text,
  report_pdf_url text,
  shareable_token text unique default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz default now(),
  unique(brand_id, month, year)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table brands enable row level security;
alter table brand_profiles enable row level security;
alter table brand_assets enable row level security;
alter table brand_memberships enable row level security;
alter table client_domains enable row level security;
alter table posts enable row level security;
alter table grid_plans enable row level security;
alter table campaigns enable row level security;
alter table briefs enable row level security;
alter table reports enable row level security;

-- Helper: check if calling user has a membership role for this brand
create or replace function user_brand_role(p_brand_id uuid)
returns text language sql security definer as $$
  select role from brand_memberships
  where user_id = auth.uid() and brand_id = p_brand_id
  limit 1;
$$;

-- Helper: is the calling user a MediaBubble team member?
create or replace function is_mb_team()
returns boolean language sql security definer as $$
  select exists (
    select 1 from brand_memberships
    where user_id = auth.uid()
    and role in ('mb_owner','mb_pm','mb_designer','mb_copywriter')
  );
$$;

-- brands: MB team sees all; clients see their own
create policy "MB team sees all brands" on brands
  for select using (is_mb_team());

create policy "Clients see their brand" on brands
  for select using (
    exists (
      select 1 from brand_memberships
      where user_id = auth.uid() and brand_id = brands.id
    )
  );

create policy "MB team manages brands" on brands
  for all using (is_mb_team());

create policy "Members access their brand_profile" on brand_profiles
  for select using (user_brand_role(brand_id) is not null);

create policy "MB team manages brand_profiles" on brand_profiles
  for all using (is_mb_team());

create policy "Members access their brand_assets" on brand_assets
  for select using (user_brand_role(brand_id) is not null);

create policy "MB team manages brand_assets" on brand_assets
  for all using (is_mb_team());

create policy "Members access their posts" on posts
  for select using (user_brand_role(brand_id) is not null);

create policy "MB team manages posts" on posts
  for all using (is_mb_team());

create policy "Members access their briefs" on briefs
  for select using (user_brand_role(brand_id) is not null);

create policy "MB team manages briefs" on briefs
  for all using (is_mb_team());

create policy "Members access their campaigns" on campaigns
  for select using (user_brand_role(brand_id) is not null);

create policy "MB team manages campaigns" on campaigns
  for all using (is_mb_team());

create policy "Members access their reports" on reports
  for select using (user_brand_role(brand_id) is not null);

create policy "MB team manages reports" on reports
  for all using (is_mb_team());

create policy "User sees own memberships" on brand_memberships
  for select using (user_id = auth.uid() or is_mb_team());

create policy "MB team manages memberships" on brand_memberships
  for all using (is_mb_team());
