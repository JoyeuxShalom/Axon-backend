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
exports.EmergencyContactsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const emergency_contacts_service_1 = require("./emergency-contacts.service");
const create_contact_dto_1 = require("./dto/create-contact.dto");
const update_contact_dto_1 = require("./dto/update-contact.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let EmergencyContactsController = class EmergencyContactsController {
    constructor(contactsService) {
        this.contactsService = contactsService;
    }
    listContacts(req) {
        return this.contactsService.listContacts(req.user.uid);
    }
    addContact(req, dto) {
        return this.contactsService.addContact(req.user.uid, dto);
    }
    updateContact(req, id, dto) {
        return this.contactsService.updateContact(req.user.uid, id, dto);
    }
    deleteContact(req, id) {
        return this.contactsService.deleteContact(req.user.uid, id);
    }
    triggerSOS(req) {
        return this.contactsService.triggerSOS(req.user.uid);
    }
};
exports.EmergencyContactsController = EmergencyContactsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all emergency contacts for the authenticated user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of emergency contacts.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmergencyContactsController.prototype, "listContacts", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new emergency contact' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Contact added successfully.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_contact_dto_1.CreateContactDto]),
    __metadata("design:returntype", void 0)
], EmergencyContactsController.prototype, "addContact", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing emergency contact' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contact updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact not found.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_contact_dto_1.UpdateContactDto]),
    __metadata("design:returntype", void 0)
], EmergencyContactsController.prototype, "updateContact", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an emergency contact' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contact deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Contact not found.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EmergencyContactsController.prototype, "deleteContact", null);
__decorate([
    (0, common_1.Post)('sos'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger a manual SOS alert to all contacts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SOS alert sent.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmergencyContactsController.prototype, "triggerSOS", null);
exports.EmergencyContactsController = EmergencyContactsController = __decorate([
    (0, swagger_1.ApiTags)('Emergency Contacts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.FirebaseAuthGuard),
    (0, common_1.Controller)('mobile/emergency-contacts'),
    __metadata("design:paramtypes", [emergency_contacts_service_1.EmergencyContactsService])
], EmergencyContactsController);
//# sourceMappingURL=emergency-contacts.controller.js.map