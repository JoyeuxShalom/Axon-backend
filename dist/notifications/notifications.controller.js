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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notifications_service_1 = require("./notifications.service");
const update_token_dto_1 = require("./dto/update-token.dto");
const mark_read_dto_1 = require("./dto/mark-read.dto");
const notification_preferences_dto_1 = require("./dto/notification-preferences.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    saveToken(req, dto) {
        return this.notificationsService.saveToken(req.user.uid, dto.fcmToken);
    }
    getFeed(req, type, limit) {
        return this.notificationsService.getFeed(req.user.uid, type, limit ? parseInt(limit, 10) : undefined);
    }
    markAsRead(req, dto) {
        return this.notificationsService.markAsRead(req.user.uid, dto.notificationIds);
    }
    markAllAsRead(req) {
        return this.notificationsService.markAllAsRead(req.user.uid);
    }
    getPreferences(req) {
        return this.notificationsService.getPreferences(req.user.uid);
    }
    updatePreferences(req, dto) {
        return this.notificationsService.updatePreferences(req.user.uid, dto);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)('token'),
    (0, swagger_1.ApiOperation)({ summary: 'Save the mobile device FCM token for push alerts' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Token saved successfully.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_token_dto_1.UpdateFcmTokenDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "saveToken", null);
__decorate([
    (0, common_1.Get)('feed'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification feed for the authenticated user' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: ['health', 'system'], description: 'Filter by notification type' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Max number of notifications to return' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of notifications.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Patch)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark specific notifications as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notifications marked as read.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mark_read_dto_1.MarkReadDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('read-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All notifications marked as read.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Get)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification preference toggles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns notification preferences.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Patch)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Update notification preference toggles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferences updated successfully.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, notification_preferences_dto_1.NotificationPreferencesDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "updatePreferences", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('Push Notifications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map