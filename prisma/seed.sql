-- NEXUS SEED SCRIPT (v4.5)
-- Run this in the Supabase SQL Editor if npx prisma db seed fails.

-- 1. Create GlobalStats
INSERT INTO "global_stats" ("id", "total_burned", "treasury_balance", "operational_revenue", "circulating_supply", "updated_at")
VALUES ('nexus_global_stats', 0, 0, 0, 0, NOW())
ON CONFLICT ("id") DO NOTHING;

-- 2. Create Admin User
-- Password: admin123
INSERT INTO "users" ("id", "name", "username", "email", "password_hash", "role", "bio", "city", "area_of_expertise", "title", "balance", "xp", "level", "created_at")
VALUES (
    gen_random_uuid(), 
    'Admin Nexus', 
    'admin', 
    'admin@nexus.com', 
    '$2b$10$YUflB2jmzIYvfZFi0KDAUs7xbyY3B7Au', 
    'ADMIN', 
    'Administrador do Portal Nexus', 
    'São Paulo', 
    'Gestão', 
    'Fundador', 
    10000.0, 
    5000, 
    10, 
    NOW()
)
ON CONFLICT ("email") DO NOTHING;

-- 3. Create Test User
-- Password: test123
INSERT INTO "users" ("id", "name", "username", "email", "password_hash", "role", "bio", "city", "area_of_expertise", "title", "balance", "xp", "level", "created_at")
VALUES (
    gen_random_uuid(), 
    'Usuário Teste', 
    'testuser', 
    'test@nexus.com', 
    '$2b$10$4IjjJarCS/FEwWNsZGgyHJQf8DS7Rl2m', 
    'USER', 
    'Conta de teste do sistema', 
    'Rio de Janeiro', 
    'Estudos', 
    'Aprendiz', 
    100.0, 
    500, 
    3, 
    NOW()
)
ON CONFLICT ("email") DO NOTHING;

-- 4. Create System Accounts (Required for Economy Module)
INSERT INTO "users" ("id", "name", "email", "password_hash", "role")
VALUES 
('PROTOCOL_MINT', 'Nexus Protocol (Mint)', 'system_protocol_mint@nexus.internal', 'SYSTEM_ACCOUNT', 'ADMIN'),
('PROTOCOL_BURN', 'Nexus Protocol (Burn)', 'system_protocol_burn@nexus.internal', 'SYSTEM_ACCOUNT', 'ADMIN'),
('TOKEN_BRIDGE', 'Nexus Token Bridge', 'system_token_bridge@nexus.internal', 'SYSTEM_ACCOUNT', 'ADMIN'),
('SYSTEM', 'Nexus System', 'system_system@nexus.internal', 'SYSTEM_ACCOUNT', 'ADMIN')
ON CONFLICT ("id") DO NOTHING;
