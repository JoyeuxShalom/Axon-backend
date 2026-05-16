"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthReportsModule = void 0;
const common_1 = require("@nestjs/common");
const health_reports_controller_1 = require("./health-reports.controller");
const health_reports_service_1 = require("./health-reports.service");
let HealthReportsModule = class HealthReportsModule {
};
exports.HealthReportsModule = HealthReportsModule;
exports.HealthReportsModule = HealthReportsModule = __decorate([
    (0, common_1.Module)({
        controllers: [health_reports_controller_1.HealthReportsController],
        providers: [health_reports_service_1.HealthReportsService],
        exports: [health_reports_service_1.HealthReportsService],
    })
], HealthReportsModule);
//# sourceMappingURL=health-reports.module.js.map