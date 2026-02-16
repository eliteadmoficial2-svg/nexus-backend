import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const ids = ['PROTOCOL_MINT', 'PROTOCOL_BURN', 'TOKEN_BRIDGE', 'SYSTEM'];
    const users = await prisma.user.findMany({
        where: { id: { in: ids } }
    });
    console.log('Found system users:', users.map(u => u.id));
}

main().catch(console.error).finally(() => prisma.$disconnect());
