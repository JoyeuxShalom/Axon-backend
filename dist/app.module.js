"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const firebase_module_1 = require("./firebase/firebase.module");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const patient_module_1 = require("./patient/patient.module");
const telemetry_module_1 = require("./telemetry/telemetry.module");
const risk_engine_module_1 = require("./risk-engine/risk-engine.module");
const mobile_auth_module_1 = require("./mobile-auth/mobile-auth.module");
const notifications_module_1 = require("./notifications/notifications.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            firebase_module_1.FirebaseModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            patient_module_1.PatientModule,
            telemetry_module_1.TelemetryModule, risk_engine_module_1.RiskEngineModule, mobile_auth_module_1.MobileAuthModule, notifications_module_1.NotificationsModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map