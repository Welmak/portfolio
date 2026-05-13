// Supabase database types
export interface DbProject {
  id: string
  title: string
  category: string
  year: string
  description: string
  image_url: string
  video_url: string | null
  slug: string | null
  link: string
  color: string | null
  sort_order: number
  content: { type: string; value: string; caption?: string }[] | null
  created_at: string
  updated_at: string
}

export interface DbAbout {
  id: string
  content_key: string
  content_value: string
}

export interface DbExperience {
  id: string
  role: string
  company: string
  period: string
  highlights: string[]
  sort_order: number
}

// SQL to create tables (run in Supabase SQL Editor):
export const SCHEMA_SQL = `
-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  video_url TEXT,
  link TEXT DEFAULT '#',
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  content JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About table
CREATE TABLE about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT UNIQUE NOT NULL,
  content_value TEXT NOT NULL
);

-- Experience table
CREATE TABLE experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  highlights JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_projects_sort ON projects(sort_order);
CREATE INDEX idx_experience_sort ON experience(sort_order);

-- Storage bucket for images
-- Create bucket 'images' in Supabase Storage UI, set to public

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

-- Admin-only policies (replace with your admin user ID)
CREATE POLICY "Admin can manage projects" ON projects
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage about" ON about
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin can manage experience" ON experience
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Public read access
CREATE POLICY "Public can read projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public can read about" ON about
  FOR SELECT USING (true);

CREATE POLICY "Public can read experience" ON experience
  FOR SELECT USING (true);
`;
