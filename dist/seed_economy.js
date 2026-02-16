"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const stats = await prisma.globalStats.upsert({
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
    console.log('Global Economy Stats initialized:', stats);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed_economy.js.map