"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerritoryModule = void 0;
const common_1 = require("@nestjs/common");
const territory_service_1 = require("./territory.service");
const territory_controller_1 = require("./territory.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
const economy_module_1 = require("../economy/economy.module");
const run_service_1 = require("./run.service");
const run_controller_1 = require("./run.controller");
let TerritoryModule = class TerritoryModule {
};
exports.TerritoryModule = TerritoryModule;
exports.TerritoryModule = TerritoryModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, economy_module_1.EconomyModule],
        controllers: [territory_controller_1.TerritoryController, run_controller_1.RunController],
        providers: [territory_service_1.TerritoryService, run_service_1.RunService],
        exports: [territory_service_1.TerritoryService, run_service_1.RunService],
    })
], TerritoryModule);
//# sourceMappingURL=territory.module.js.map