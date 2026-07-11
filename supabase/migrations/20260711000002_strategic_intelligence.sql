-- Brand AI Memory table
create table if not exists brand_memories (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid not null references brands(id) on delete cascade unique,
  successful_keywords text[] default '{}',
  avoid_keywords text[] default '{}',
  preferred_formats text[] default '{}',
  updated_at timestamptz default now()
);

-- Competitor Tracker table
create table if not exists competitor_tracks (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid not null references brands(id) on delete cascade,
  competitor_handle text not null,
  recent_posts jsonb default '[]',
  updated_at timestamptz default now(),
  unique(brand_id, competitor_handle)
);

-- Client Post Feedback table
create table if not exists post_feedback (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references posts(id) on delete cascade unique,
  rating integer check (rating >= 1 and rating <= 5),
  comments text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table brand_memories enable row level security;
alter table competitor_tracks enable row level security;
alter table post_feedback enable row level security;

-- Setup RLS Policies
create policy "Members view memories" on brand_memories
  for select using (user_brand_role(brand_id) is not null);

create policy "MB team manages memories" on brand_memories
  for all using (is_mb_team());

create policy "Members view competitor tracks" on competitor_tracks
  for select using (user_brand_role(brand_id) is not null);

create policy "MB team manages competitor tracks" on competitor_tracks
  for all using (is_mb_team());

create policy "Members view feedback" on post_feedback
  for select using (
    exists (
      select 1 from posts
      where posts.id = post_feedback.post_id
      and user_brand_role(posts.brand_id) is not null
    )
  );

create policy "Members manage feedback" on post_feedback
  for all using (
    exists (
      select 1 from posts
      where posts.id = post_feedback.post_id
      and user_brand_role(posts.brand_id) is not null
    )
  );
