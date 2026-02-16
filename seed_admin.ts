
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'otacilio2966@gmail.com';

    console.log(`Checking for user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error(`User with email ${email} not found.`);
        return;
    }

    console.log(`Found user: ${user.name} (${user.id}). Updating role to ADMIN...`);

    const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
    });

    console.log(`User ${updatedUser.name} is now an ${updatedUser.role}.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
