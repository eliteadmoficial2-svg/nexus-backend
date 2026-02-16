"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
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
            balance: 10000.0,
            xp: 5000,
            level: 10,
        },
    });
    console.log('✅ Admin user created:', admin.email);
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
//# sourceMappingURL=seed.js.map