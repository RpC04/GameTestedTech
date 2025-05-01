-- This is a sample schema for Supabase
-- You can run this in the Supabase SQL editor to set up your database

-- Create tables
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft',
  category_id INTEGER REFERENCES categories(id),
  tags JSONB DEFAULT '[]',
  author VARCHAR(255),
  meta_title VARCHAR(255),
  meta_description TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admins)
CREATE POLICY "Allow full access for authenticated users" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access for authenticated users" ON tags
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access for authenticated users" ON articles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access for authenticated users" ON comments
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for anonymous users (public)
CREATE POLICY "Allow read access for anonymous users to published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow read access for anonymous users" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow read access for anonymous users" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Allow read access for anonymous users to approved comments" ON comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow insert access for anonymous users to comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
BEFORE UPDATE ON tags
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO categories (name, slug, description)
VALUES 
  ('Technology', 'technology', 'Articles about the latest technology trends'),
  ('Gaming', 'gaming', 'Gaming news, reviews, and guides'),
  ('Hardware', 'hardware', 'Hardware reviews and comparisons'),
  ('Guides', 'guides', 'How-to guides and tutorials');

INSERT INTO tags (name, slug)
VALUES 
  ('Artificial Intelligence', 'artificial-intelligence'),
  ('Game Design', 'game-design'),
  ('NPCs', 'npcs'),
  ('Procedural Generation', 'procedural-generation'),
  ('Gaming Technology', 'gaming-technology');
