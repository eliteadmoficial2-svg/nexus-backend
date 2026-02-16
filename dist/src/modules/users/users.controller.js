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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async search(query, req) {
        const currentUserId = req?.user?.id;
        return this.usersService.search(query, currentUserId);
    }
    async findOne(id, req) {
        return this.usersService.findById(id);
    }
    async getProfile(id, req) {
        console.log(`[DEBUG] getProfile for ${id} requested by ${req.user.id}`);
        try {
            const profile = await this.usersService.getProfile(id, req.user.id);
            console.log(`[DEBUG] getProfile result:`, profile ? 'Found' : 'Null');
            if (!profile) {
                throw new common_1.NotFoundException('User not found');
            }
            return profile;
        }
        catch (e) {
            console.error(`[DEBUG] getProfile Error:`, e);
            throw e;
        }
    }
    async follow(id, req) {
        console.log(`[DEBUG] Follow request: ${req.user.id} -> ${id}`);
        try {
            return await this.usersService.follow(req.user.id, id);
        }
        catch (e) {
            console.error(`[DEBUG] Follow Error:`, e);
            throw e;
        }
    }
    async unfollow(id, req) {
        console.log(`[DEBUG] Unfollow request: ${req.user.id} -> ${id}`);
        try {
            return await this.usersService.unfollow(req.user.id, id);
        }
        catch (e) {
            console.error(`[DEBUG] Unfollow Error:`, e);
            throw e;
        }
    }
    async getAdminStats() {
        const count = await this.usersService.countAll();
        return {
            users: count,
            status: 'Online',
            latency: '14ms',
            alerts: 0
        };
    }
    async listUsers(limit) {
        const take = parseInt(limit) || 50;
        return this.usersService.listAll(0, take);
    }
    async toggleBan(id) {
        return this.usersService.toggleBan(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('profile/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)(':id/follow'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "follow", null);
__decorate([
    (0, common_1.Post)(':id/unfollow'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "unfollow", null);
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAdminStats", null);
__decorate([
    (0, common_1.Get)('admin/list'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Patch)('admin/:id/ban'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "toggleBan", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map