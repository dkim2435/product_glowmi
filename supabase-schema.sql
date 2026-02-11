-- Glowmi Supabase Schema
-- Run this SQL in Supabase Dashboard > SQL Editor

-- ===== Tables =====

-- profiles — User basic info (auto-created on signup)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- analysis_results — Analysis results (one row per user, latest results only)
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Personal Color
    pc_type TEXT,
    pc_confidence INTEGER,
    pc_warmth REAL,
    pc_depth REAL,
    pc_clarity REAL,
    pc_skin_rgb JSONB,
    pc_scores JSONB,
    pc_analyzed_at TIMESTAMPTZ,
    -- Face Shape
    fs_shape TEXT,
    fs_confidence INTEGER,
    fs_scores JSONB,
    fs_analyzed_at TIMESTAMPTZ,
    -- Skin Condition
    skin_redness INTEGER,
    skin_oiliness INTEGER,
    skin_dryness INTEGER,
    skin_dark_spots INTEGER,
    skin_texture INTEGER,
    skin_overall_score INTEGER,
    skin_analyzed_at TIMESTAMPTZ,
    -- Quiz
    quiz_type TEXT,
    quiz_season TEXT,
    quiz_scores JSONB,
    quiz_taken_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- skin_diary — Skin diary entries (one per day per user)
CREATE TABLE skin_diary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    -- AI analysis (optional)
    ai_redness INTEGER,
    ai_oiliness INTEGER,
    ai_dryness INTEGER,
    ai_dark_spots INTEGER,
    ai_texture INTEGER,
    ai_overall_score INTEGER,
    -- Manual input
    overall_condition TEXT CHECK (overall_condition IN ('good','normal','bad')),
    sleep_hours TEXT CHECK (sleep_hours IN ('<4h','5-6h','7-8h','9h+')),
    stress_level TEXT CHECK (stress_level IN ('low','medium','high')),
    water_intake TEXT CHECK (water_intake IN ('low','normal','high')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, entry_date)
);

-- routines — AM/PM skincare routines (max 2 rows per user)
CREATE TABLE routines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    routine_type TEXT NOT NULL CHECK (routine_type IN ('am','pm')),
    steps JSONB NOT NULL DEFAULT '[]',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, routine_type)
);

-- ===== Row Level Security =====

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;

-- profiles policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
    ON profiles FOR DELETE
    USING (auth.uid() = id);

-- analysis_results policies
CREATE POLICY "Users can view own results"
    ON analysis_results FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own results"
    ON analysis_results FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own results"
    ON analysis_results FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can delete own results"
    ON analysis_results FOR DELETE
    USING (auth.uid() = id);

-- skin_diary policies
CREATE POLICY "Users can view own diary"
    ON skin_diary FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diary"
    ON skin_diary FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diary"
    ON skin_diary FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diary"
    ON skin_diary FOR DELETE
    USING (auth.uid() = user_id);

-- routines policies
CREATE POLICY "Users can view own routines"
    ON routines FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routines"
    ON routines FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines"
    ON routines FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines"
    ON routines FOR DELETE
    USING (auth.uid() = user_id);

-- ===== Trigger: Auto-create profile + analysis_results on signup =====

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'full_name',
        NEW.raw_user_meta_data ->> 'avatar_url'
    );
    INSERT INTO analysis_results (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
