"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesModule = void 0;
const common_1 = require("@nestjs/common");
const activities_service_1 = require("./activities.service");
const activities_controller_1 = require("./activities.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
const users_module_1 = require("../users/users.module");
const ranking_module_1 = require("../ranking/ranking.module");
const economy_module_1 = require("../economy/economy.module");
let ActivitiesModule = class ActivitiesModule {
};
exports.ActivitiesModule = ActivitiesModule;
exports.ActivitiesModule = ActivitiesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, users_module_1.UsersModule, ranking_module_1.RankingModule, economy_module_1.EconomyModule],
        providers: [activities_service_1.ActivitiesService],
        controllers: [activities_controller_1.ActivitiesController],
        exports: [activities_service_1.ActivitiesService],
    })
], ActivitiesModule);
//# sourceMappingURL=activities.module.js.map