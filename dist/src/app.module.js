"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const habits_module_1 = require("./modules/habits/habits.module");
const progress_module_1 = require("./modules/progress/progress.module");
const ranking_module_1 = require("./modules/ranking/ranking.module");
const reports_module_1 = require("./modules/reports/reports.module");
const activities_module_1 = require("./modules/activities/activities.module");
const social_module_1 = require("./modules/social/social.module");
const stories_module_1 = require("./modules/stories/stories.module");
const territory_module_1 = require("./modules/territory/territory.module");
const economy_module_1 = require("./modules/economy/economy.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            habits_module_1.HabitsModule,
            progress_module_1.ProgressModule,
            ranking_module_1.RankingModule,
            reports_module_1.ReportsModule,
            activities_module_1.ActivitiesModule,
            social_module_1.SocialModule,
            stories_module_1.StoriesModule,
            territory_module_1.TerritoryModule,
            economy_module_1.EconomyModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map