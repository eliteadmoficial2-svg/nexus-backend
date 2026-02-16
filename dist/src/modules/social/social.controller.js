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
exports.SocialController = void 0;
const common_1 = require("@nestjs/common");
const social_service_1 = require("./social.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let SocialController = class SocialController {
    socialService;
    constructor(socialService) {
        this.socialService = socialService;
    }
    async comment(req, activityId, content) {
        return this.socialService.addComment(req.user.id, activityId, content);
    }
    async react(req, activityId, type) {
        return this.socialService.addReaction(req.user.id, activityId, type);
    }
    async getComments(activityId) {
        return this.socialService.getComments(activityId);
    }
};
exports.SocialController = SocialController;
__decorate([
    (0, common_1.Post)('comment/:activityId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('activityId')),
    __param(2, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "comment", null);
__decorate([
    (0, common_1.Post)('react/:activityId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('activityId')),
    __param(2, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "react", null);
__decorate([
    (0, common_1.Get)('comments/:activityId'),
    __param(0, (0, common_1.Param)('activityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialController.prototype, "getComments", null);
exports.SocialController = SocialController = __decorate([
    (0, common_1.Controller)('social'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [social_service_1.SocialService])
], SocialController);
//# sourceMappingURL=social.controller.js.map