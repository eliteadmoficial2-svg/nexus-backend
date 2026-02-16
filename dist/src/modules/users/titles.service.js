"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitlesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TitlesService = class TitlesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateTitles(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { activities: true }
        });
        if (!user)
            return;
        let newTitle = user.title || "Novato";
        const totalActivities = user.activities.length;
        const totalMinutes = user.totalMinutes || 0;
        const level = user.level || 1;
        const streak = user.streakDays || 0;
        if (level >= 20)
            newTitle = "Elite Nexus";
        else if (totalMinutes >= 10000)
            newTitle = "Mentor";
        else if (streak >= 30)
            newTitle = "Inabalável";
        else if (totalActivities >= 50)
            newTitle = "Executor";
        else if (streak >= 7)
            newTitle = "Resiliente";
        else if (level >= 5)
            newTitle = "Veterano";
        if (newTitle !== user.title) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { title: newTitle }
            });
        }
    }
};
exports.TitlesService = TitlesService;
exports.TitlesService = TitlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TitlesService);
//# sourceMappingURL=titles.service.js.map