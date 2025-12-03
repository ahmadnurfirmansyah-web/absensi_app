// supabase.js

// Import createClient (untuk browser cukup langsung pakai supabase-js CDN)
const supabaseUrl = "https://hgivxyqggvsexblarzut.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaXZ4eXFnZ3ZzZXhibGFyenV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDE4MzUsImV4cCI6MjA3OTgxNzgzNX0.AAJfsDnPE9L-J1ZSf6cldKiw94YdGsisgchjX6lxuTU";

// Inisialisasi client
const db = supabase.createClient(supabaseUrl, supabaseKey);
