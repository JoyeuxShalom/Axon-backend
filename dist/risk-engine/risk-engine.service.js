"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskEngineService = void 0;
const common_1 = require("@nestjs/common");
let RiskEngineService = class RiskEngineService {
    evaluateStrokeRisk(data) {
        let riskScore = 0.1;
        let isCritical = false;
        let alertReason = '';
        if (data.systolic >= 180 || data.diastolic >= 110) {
            riskScore += 0.6;
            isCritical = true;
            alertReason = 'CRITICAL: Severe Hypertensive Spike detected. High stroke risk.';
        }
        else if (data.systolic >= 140) {
            riskScore += 0.3;
            alertReason = 'WARNING: Elevated Blood Pressure.';
        }
        if (data.spo2 < 90) {
            riskScore += 0.4;
            isCritical = true;
            alertReason += ' CRITICAL: SpO2 dropped below 90%.';
        }
        else if (data.spo2 < 95) {
            riskScore += 0.2;
        }
        if (data.bpm > 130 || data.bpm < 50) {
            riskScore += 0.3;
            isCritical = true;
            alertReason += ' CRITICAL: Severe abnormal heart rate.';
        }
        if (data.fall_detected) {
            riskScore += 0.5;
            isCritical = true;
            alertReason += ' CRITICAL: Sudden fall or severe loss of motor control detected.';
        }
        riskScore = Math.min(0.99, riskScore);
        return {
            risk_confidence: parseFloat(riskScore.toFixed(2)),
            is_critical: isCritical,
            status: isCritical ? 'UNRESOLVED' : 'STABLE',
            reason: alertReason.trim() || 'Vitals normal.',
        };
    }
};
exports.RiskEngineService = RiskEngineService;
exports.RiskEngineService = RiskEngineService = __decorate([
    (0, common_1.Injectable)()
], RiskEngineService);
//# sourceMappingURL=risk-engine.service.js.map