import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TitlesService {
    constructor(private prisma: PrismaService) { }

    async updateTitles(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { activities: true }
        });

        if (!user) return;

        let newTitle = user.title || "Novato";
        const totalActivities = user.activities.length;
        const totalMinutes = user.totalMinutes || 0;
        const level = user.level || 1;
        const streak = user.streakDays || 0;

        // Logic (Priority based)
        if (level >= 20) newTitle = "Elite Nexus";
        else if (totalMinutes >= 10000) newTitle = "Mentor";
        else if (streak >= 30) newTitle = "Inabalável";
        else if (totalActivities >= 50) newTitle = "Executor";
        else if (streak >= 7) newTitle = "Resiliente";
        else if (level >= 5) newTitle = "Veterano";

        if (newTitle !== user.title) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { title: newTitle }
            });
        }
    }
}
