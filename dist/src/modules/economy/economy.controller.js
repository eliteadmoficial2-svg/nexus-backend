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
exports.EconomyController = void 0;
const common_1 = require("@nestjs/common");
const economy_service_1 = require("./economy.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let EconomyController = class EconomyController {
    economyService;
    constructor(economyService) {
        this.economyService = economyService;
    }
    async getStats() {
        return this.economyService.getGlobalStats();
    }
    async getPrice() {
        return this.economyService.getPrice();
    }
    async getHistory(req) {
        return this.economyService.getHistory(req.user.userId);
    }
    async buy(req, data) {
        return this.economyService.buy(req.user.userId, data.amount);
    }
    async sell(req, data) {
        return this.economyService.sell(req.user.userId, data.amount);
    }
    async transfer(req, data) {
        return this.economyService.transfer(req.user.userId, data.to, data.amount);
    }
    async withdrawToChain(req, data) {
        return this.economyService.withdrawToChain(req.user.userId, data.amount, data.walletAddress);
    }
};
exports.EconomyController = EconomyController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EconomyController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('price'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EconomyController.prototype, "getPrice", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EconomyController.prototype, "getHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('buy'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EconomyController.prototype, "buy", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('sell'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EconomyController.prototype, "sell", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('transfer'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EconomyController.prototype, "transfer", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('withdraw-to-chain'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EconomyController.prototype, "withdrawToChain", null);
exports.EconomyController = EconomyController = __decorate([
    (0, common_1.Controller)('economy'),
    __metadata("design:paramtypes", [economy_service_1.EconomyService])
], EconomyController);
//# sourceMappingURL=economy.controller.js.map