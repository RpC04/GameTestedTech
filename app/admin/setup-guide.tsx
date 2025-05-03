"use client"
import { useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle, Copy, ExternalLink } from "lucide-react"

export default function SetupGuide() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard Setup Guide</h1>
          <p className="text-gray-300">Follow these steps to set up your admin dashboard with Supabase integration.</p>
        </div>

        <div className="space-y-8">
          {/* Step 1: Create Supabase Project */}
          <div className="bg-[#1a1a2e] rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-[#9d8462] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                1
              </span>
              Create a Supabase Project
            </h2>
            <p className="mb-4">
              First, you need to create a new project in Supabase to store your articles, categories, and user data.
            </p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>
                Go to{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9d8462] hover:underline"
                >
                  Supabase.com
                </a>{" "}
                and sign in or create an account
              </li>
              <li>Click "New Project" and follow the setup wizard</li>
              <li>Choose a name for your project (e.g., "game-website")</li>
              <li>Set a secure database password (keep this safe!)</li>
              <li>Choose a region close to your target audience</li>
              <li>Click "Create new project"</li>
            </ol>
            <div className="flex justify-end">
              <a
                href="https://supabase.com/dashboard/projects"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#9d8462] hover:text-[#8d7452]"
              >
                Go to Supabase Dashboard <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Step 2: Set Up Database Schema */}
          <div className="bg-[#1a1a2e] rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-[#9d8462] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                2
              </span>
              Set Up Database Schema
            </h2>
            <p className="mb-4">
              Once your project is created, you need to set up the database schema for your articles, categories, and
              other data.
            </p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>In your Supabase project, go to the "SQL Editor" section</li>
              <li>Click "New Query"</li>
              <li>Copy and paste the SQL schema below</li>
              <li>Click "Run" to execute the SQL and create your tables</li>
            </ol>

            <div className="relative bg-[#0a0a14] rounded-md p-4 mb-4">
              <button
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white"
                onClick={() =>
                  copyToClipboard(
                    `-- This is a sample schema for Supabase
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
  ('Gaming Technology', 'gaming-technology');`,
                    "sql-schema",
                  )
                }
              >
                <Copy className="h-4 w-4" />
                {copied === "sql-schema" && (
                  <span className="absolute -top-1 -right-1 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                )}
              </button>
              <pre className="text-gray-300 text-sm overflow-auto max-h-60">
                <code>
                  {`-- This is a sample schema for Supabase
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

-- More SQL code (truncated for brevity)
-- See the full schema in lib/supabase-schema.sql`}
                </code>
              </pre>
            </div>

            <div className="flex justify-end">
              <a
                href="https://supabase.com/dashboard/project/_/sql"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#9d8462] hover:text-[#8d7452]"
              >
                Go to SQL Editor <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Step 3: Create Admin User */}
          <div className="bg-[#1a1a2e] rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-[#9d8462] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                3
              </span>
              Create Admin User
            </h2>
            <p className="mb-4">Now you need to create an admin user who can access the dashboard.</p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>In your Supabase project, go to the "Authentication" section</li>
              <li>Click on "Users" tab</li>
              <li>Click "Add User" or "Invite" button</li>
              <li>Enter the email and password for your admin user</li>
              <li>Click "Create User"</li>
            </ol>
            <div className="flex justify-end">
              <a
                href="https://supabase.com/dashboard/project/_/auth/users"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#9d8462] hover:text-[#8d7452]"
              >
                Go to Authentication <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Step 4: Get API Keys */}
          <div className="bg-[#1a1a2e] rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-[#9d8462] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                4
              </span>
              Get API Keys
            </h2>
            <p className="mb-4">
              You need to get your Supabase URL and anon key to connect your dashboard to Supabase.
            </p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>In your Supabase project, go to the "Settings" section (gear icon)</li>
              <li>Click on "API" in the sidebar</li>
              <li>Under "Project URL", copy your project URL</li>
              <li>Under "Project API keys", copy the "anon" key (public)</li>
            </ol>
            <div className="bg-[#0a0a14] p-4 rounded-md mb-4">
              <p className="text-sm text-gray-400 mb-2">Add these to your .env.local file:</p>
              <div className="relative">
                <pre className="text-green-400 text-sm">
                  NEXT_PUBLIC_SUPABASE_URL=your_project_url
                  <br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
                </pre>
                <button
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white"
                  onClick={() =>
                    copyToClipboard(
                      `NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`,
                      "env-vars",
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                  {copied === "env-vars" && (
                    <span className="absolute -top-1 -right-1 text-green-500">
                      <CheckCircle className="h-4 w-4" />
                    </span>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <a
                href="https://supabase.com/dashboard/project/_/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#9d8462] hover:text-[#8d7452]"
              >
                Go to API Settings <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Step 5: Access Dashboard */}
          <div className="bg-[#1a1a2e] rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-[#9d8462] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                5
              </span>
              Access Your Dashboard
            </h2>
            <p className="mb-4">Once you've completed the setup, you can access your admin dashboard.</p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Restart your development server to apply the environment variables</li>
              <li>
                Navigate to <code className="bg-[#0a0a14] px-2 py-1 rounded">/admin</code> in your browser
              </li>
              <li>Log in with the admin user credentials you created</li>
              <li>Start managing your content!</li>
            </ol>
            <div className="bg-[#0a0a14] p-4 rounded-md mb-4">
              <div className="flex items-start gap-3 text-yellow-400">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  Remember to add these environment variables to your production environment when you deploy your site.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/admin" className="flex items-center gap-1 text-[#9d8462] hover:text-[#8d7452]">
                Go to Admin Dashboard <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
