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
exports.RunController = void 0;
const common_1 = require("@nestjs/common");
const run_service_1 = require("./run.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
let RunController = class RunController {
    runService;
    constructor(runService) {
        this.runService = runService;
    }
    async startRun(req) {
        return this.runService.startRun(req.user.id);
    }
    async addPoint(runId, req, data) {
        return this.runService.addPoint(runId, req.user.id, data.lat, data.lng);
    }
    async finishRun(runId, data) {
        return this.runService.finishRun(runId, data.distance, data.avgSpeed, data.polyline);
    }
    async getUserRuns(req) {
        return this.runService.getUserRuns(req.user.id);
    }
    async getRunDetails(id) {
        return this.runService.getRunDetails(id);
    }
};
exports.RunController = RunController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RunController.prototype, "startRun", null);
__decorate([
    (0, common_1.Post)(':id/point'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RunController.prototype, "addPoint", null);
__decorate([
    (0, common_1.Post)(':id/finish'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RunController.prototype, "finishRun", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RunController.prototype, "getUserRuns", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RunController.prototype, "getRunDetails", null);
exports.RunController = RunController = __decorate([
    (0, common_1.Controller)('runs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [run_service_1.RunService])
], RunController);
//# sourceMappingURL=run.controller.js.map