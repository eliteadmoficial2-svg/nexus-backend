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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerritoryController = void 0;
const common_1 = require("@nestjs/common");
const territory_service_1 = require("./territory.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let TerritoryController = class TerritoryController {
    territoryService;
    constructor(territoryService) {
        this.territoryService = territoryService;
    }
    async getMap(minLat, maxLat, minLng, maxLng) {
        return this.territoryService.getTerritoriesInView(parseFloat(minLat), parseFloat(maxLat), parseFloat(minLng), parseFloat(maxLng));
    }
    async getUserTerritories(req) {
        return this.territoryService.getUserTerritories(req.user.id);
    }
    async getRanking() {
        return this.territoryService.getGlobalRanking();
    }
};
exports.TerritoryController = TerritoryController;
__decorate([
    (0, common_1.Get)('map'),
    __param(0, (0, common_1.Query)('minLat')),
    __param(1, (0, common_1.Query)('maxLat')),
    __param(2, (0, common_1.Query)('minLng')),
    __param(3, (0, common_1.Query)('maxLng')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], TerritoryController.prototype, "getMap", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TerritoryController.prototype, "getUserTerritories", null);
__decorate([
    (0, common_1.Get)('ranking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TerritoryController.prototype, "getRanking", null);
exports.TerritoryController = TerritoryController = __decorate([
    (0, common_1.Controller)('territory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [territory_service_1.TerritoryService])
], TerritoryController);
//# sourceMappingURL=territory.controller.js.map