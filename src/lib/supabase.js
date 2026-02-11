import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://notxbgusqkyrqqrkdaly.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_9YB99zTogPRKJy0423Tbcw_tGNN2tcv'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
