import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create GlobalStats (required for economy system)
    const globalStats = await prisma.globalStats.upsert({
        where: { id: 'nexus_global_stats' },
        update: {},
        create: {
            id: 'nexus_global_stats',
            totalBurned: 0,
            treasuryBalance: 0,
            operationalRevenue: 0,
            circulatingSupply: 0,
        },
    });
    console.log('✅ GlobalStats created:', globalStats.id);

    // 2. Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@nexus.com' },
        update: {},
        create: {
            name: 'Admin Nexus',
            username: 'admin',
            email: 'admin@nexus.com',
            passwordHash: adminPassword,
            role: 'ADMIN',
            bio: 'Administrador do Portal Nexus',
            city: 'São Paulo',
            expertise: 'Gestão',
            title: 'Fundador',
            balance: 10000.0, // Initial balance for testing
            xp: 5000,
            level: 10,
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // 3. Create Test User
    const testPassword = await bcrypt.hash('test123', 10);
    const testUser = await prisma.user.upsert({
        where: { email: 'test@nexus.com' },
        update: {},
        create: {
            name: 'Usuário Teste',
            username: 'testuser',
            email: 'test@nexus.com',
            passwordHash: testPassword,
            role: 'USER',
            bio: 'Conta de teste do sistema',
            city: 'Rio de Janeiro',
            expertise: 'Estudos',
            title: 'Aprendiz',
            balance: 100.0,
            xp: 500,
            level: 3,
        },
    });
    console.log('✅ Test user created:', testUser.email);

    console.log('🎉 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
