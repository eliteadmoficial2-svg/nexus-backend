"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const ids = ['PROTOCOL_MINT', 'PROTOCOL_BURN', 'TOKEN_BRIDGE', 'SYSTEM'];
    const users = await prisma.user.findMany({
        where: { id: { in: ids } }
    });
    console.log('Found system users:', users.map(u => u.id));
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=check_users.js.map