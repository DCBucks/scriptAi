-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    name TEXT,
    subscription_status TEXT CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    transcription_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audio_files table
CREATE TABLE IF NOT EXISTS audio_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    duration TEXT NOT NULL,
    upload_url TEXT,
    transcript TEXT,
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create summaries table
CREATE TABLE IF NOT EXISTS summaries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    audio_file_id UUID REFERENCES audio_files(id) ON DELETE CASCADE,
    main_summary TEXT NOT NULL,
    bullet_points TEXT[] NOT NULL DEFAULT '{}',
    key_topics TEXT[] NOT NULL DEFAULT '{}',
    action_items TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    audio_file_id UUID REFERENCES audio_files(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('user', 'ai')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table (for premium users)
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_audio_files_user_id ON audio_files(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_files_processing_status ON audio_files(processing_status);
CREATE INDEX IF NOT EXISTS idx_summaries_audio_file_id ON summaries(audio_file_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_audio_file_id ON chat_messages(audio_file_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = clerk_user_id);

-- Audio files policies
CREATE POLICY "Users can view own audio files" ON audio_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = audio_files.user_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert own audio files" ON audio_files
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = audio_files.user_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own audio files" ON audio_files
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = audio_files.user_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete own audio files" ON audio_files
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = audio_files.user_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

-- Summaries policies
CREATE POLICY "Users can view own summaries" ON summaries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM audio_files 
            JOIN users ON users.id = audio_files.user_id
            WHERE audio_files.id = summaries.audio_file_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert own summaries" ON summaries
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM audio_files 
            JOIN users ON users.id = audio_files.user_id
            WHERE audio_files.id = summaries.audio_file_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own summaries" ON summaries
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM audio_files 
            JOIN users ON users.id = audio_files.user_id
            WHERE audio_files.id = summaries.audio_file_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete own summaries" ON summaries
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM audio_files 
            JOIN users ON users.id = audio_files.user_id
            WHERE audio_files.id = summaries.audio_file_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

-- Chat messages policies
CREATE POLICY "Users can view own chat messages" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM audio_files 
            JOIN users ON users.id = audio_files.user_id
            WHERE audio_files.id = chat_messages.audio_file_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM audio_files 
            JOIN users ON users.id = audio_files.user_id
            WHERE audio_files.id = chat_messages.audio_file_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own chat messages" ON chat_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM audio_files 
            JOIN users ON users.id = audio_files.user_id
            WHERE audio_files.id = chat_messages.audio_file_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete own chat messages" ON chat_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM audio_files 
            JOIN users ON users.id = audio_files.user_id
            WHERE audio_files.id = chat_messages.audio_file_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audio_files_updated_at BEFORE UPDATE ON audio_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_summaries_updated_at BEFORE UPDATE ON summaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Teams policies (only team owners can manage teams)
CREATE POLICY "Users can view teams they own or are members of" ON teams
    FOR SELECT USING (
        owner_id IN (
            SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
        ) OR
        id IN (
            SELECT team_id FROM team_members 
            WHERE user_id IN (
                SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
            ) AND status = 'active'
        )
    );

CREATE POLICY "Premium users can create teams" ON teams
    FOR INSERT WITH CHECK (
        owner_id IN (
            SELECT id FROM users 
            WHERE clerk_user_id = auth.uid()::text 
            AND subscription_status = 'active'
            AND stripe_subscription_id IS NOT NULL
        )
    );

CREATE POLICY "Team owners can update their teams" ON teams
    FOR UPDATE USING (
        owner_id IN (
            SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Team owners can delete their teams" ON teams
    FOR DELETE USING (
        owner_id IN (
            SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
        )
    );

-- Team members policies
CREATE POLICY "Users can view team memberships they're part of" ON team_members
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
        ) OR
        team_id IN (
            SELECT team_id FROM team_members 
            WHERE user_id IN (
                SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
            ) AND status = 'active'
        )
    );

CREATE POLICY "Team owners and admins can manage members" ON team_members
    FOR ALL USING (
        team_id IN (
            SELECT t.id FROM teams t
            JOIN users u ON u.id = t.owner_id
            WHERE u.clerk_user_id = auth.uid()::text
        ) OR
        team_id IN (
            SELECT tm.team_id FROM team_members tm
            JOIN users u ON u.id = tm.user_id
            WHERE u.clerk_user_id = auth.uid()::text 
            AND tm.role IN ('owner', 'admin') 
            AND tm.status = 'active'
        )
    );

-- Create triggers for teams
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();  