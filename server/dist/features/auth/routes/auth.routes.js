"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const validate_middleware_js_1 = require("../../../middleware/validate.middleware.js"); // Universal validation runtime wrapper middleware
const authMiddleware_js_1 = require("../../../shared/middleware/authMiddleware.js"); // The authorization guard we built previously
const auth_validation_js_1 = require("../validatons/auth.validation.js");
const router = (0, express_1.Router)();
const controller = new auth_controller_js_1.AuthController();
router.post("/register", (0, validate_middleware_js_1.validate)(auth_validation_js_1.StudentRegisterSchema), controller.registerStudent);
router.post("/login", (0, validate_middleware_js_1.validate)(auth_validation_js_1.LoginSchema), controller.login);
router.post("/setup-password", (0, validate_middleware_js_1.validate)(auth_validation_js_1.CompleteSetupSchema), controller.setupPassword);
// 🔒 Protected Administrative Control Path Gateway
router.post("/provision", (0, authMiddleware_js_1.authorizeRoles)("admin"), (0, validate_middleware_js_1.validate)(auth_validation_js_1.AdminCreateUserSchema), controller.adminProvision);
exports.default = router;
