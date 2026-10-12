"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const auth_model_js_1 = require("../models/auth.model.js");
class AuthRepository {
    async findByIdentifier(value) {
        return auth_model_js_1.AuthCredentials.findOne({
            "identifiers.value": value.toLowerCase().trim(),
        });
    }
    async findBySetupToken(token) {
        return auth_model_js_1.AuthCredentials.findOne({
            accountSetupToken: token,
            accountSetupExpires: { $gt: new Date() },
        });
    }
    async findByVerificationToken(token) {
        return auth_model_js_1.AuthCredentials.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() },
        });
    }
    async create(data) {
        return auth_model_js_1.AuthCredentials.create(data);
    }
    async save(user) {
        return user.save();
    }
}
exports.AuthRepository = AuthRepository;
