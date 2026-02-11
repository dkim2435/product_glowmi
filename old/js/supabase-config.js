// js/supabase-config.js — Supabase client initialization

var SUPABASE_URL = 'https://notxbgusqkyrqqrkdaly.supabase.co';
var SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_9YB99zTogPRKJy0423Tbcw_tGNN2tcv';

var supabase = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null;
