import { AuthRepository } from "../repositories/auth.repository.js";
// import { IAuthCredentials } from "../models/auth.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import sendEmail from "../../../utils/sendEmail.js";
import {
  getWelcomeSetupTemplate,
  getVerificationTemplate,
} from "../templates/emailTemplates.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import logger from "../../../utils/logger.js";
import { IAuthCredentials, ILoginIdentifier } from "../models/auth.model.js";

const authRepo = new AuthRepository();

export class AuthService {
  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  // Path A: Standard Self-Registration (Students)
  async registerStudent(
    email: string,
    passwordPlain: string,
  ): Promise<IAuthCredentials> {
    const existing = await authRepo.findByIdentifier(email);
    if (existing)
      throw new ApiError(
        409,
        "An identical identity record already exists on the network.",
      );

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);
    const verificationToken = this.generateSecureToken();

    const newUser = await authRepo.create({
      identifiers: [{ type: "email", value: email }],
      passwordHash,
      role: "student",
      isEmailVerified: false,
      isPasswordSet: true, // They chose a password right away
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailContent = getVerificationTemplate(verifyUrl);

    // Fire-and-forget background mailing execution
    sendEmail({
      to: email,
      subject: "Verify your Account Registration",
      ...emailContent,
    }).catch((err) =>
      logger.error(
        `Mailing Delivery System Failure on Student Signup: ${err.message}`,
      ),
    );

    return newUser;
  }

  // Path B: Administrative Account Provisioning (No password collected upfront)
  async adminProvisionUser(
    email: string,
    role: "admin" | "staff",
    staffNumber?: string,
    nationalId?: string,
  ): Promise<IAuthCredentials> {
    const existing = await authRepo.findByIdentifier(email);
    if (existing)
      throw new ApiError(
        409,
        "This individual identity is already registered.",
      );

    // 🛠️ FIX: Explicitly type the array using our interface so it allows all three types!
    const identifiers: ILoginIdentifier[] = [{ type: "email", value: email }];

    if (staffNumber)
      identifiers.push({ type: "staff_number", value: staffNumber });
    if (nationalId)
      identifiers.push({ type: "national_id", value: nationalId });

    const setupToken = this.generateSecureToken();

    const newUser = await authRepo.create({
      identifiers, // TypeScript is completely happy now!
      role,
      isEmailVerified: true,
      isPasswordSet: false,
      accountSetupToken: setupToken,
      accountSetupExpires: new Date(Date.now() + 48 * 60 * 60 * 1000),
    });

    const setupUrl = `${process.env.FRONTEND_URL}/setup-password?token=${setupToken}`;
    const emailContent = getWelcomeSetupTemplate(setupUrl);

    sendEmail({
      to: email,
      subject:
        "Action Required: Complete your Account Architecture Configuration",
      ...emailContent,
    }).catch((err) =>
      logger.error(
        `Mailing Delivery System Failure on Admin Provisioning: ${err.message}`,
      ),
    );

    return newUser;
  }

  // Path C: Password Generation Hook for Provisioned Accounts
  async finalizeAccountSetup(
    token: string,
    passwordPlain: string,
  ): Promise<void> {
    const user = await authRepo.findBySetupToken(token);
    if (!user) throw new ApiError(400, "Validation token invalid or expired.");

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(passwordPlain, salt);
    user.isPasswordSet = true; // Account finalized!
    user.accountSetupToken = undefined;
    user.accountSetupExpires = undefined;

    await authRepo.save(user);
    logger.info(
      `Provisioned profile registration confirmed for AuthID: ${user._id}`,
    );
  }

  // Path D: Dynamic Authentication Orchestrator
  async login(
    identifierInput: string,
    passwordPlain: string,
  ): Promise<{ token: string; role: string }> {
    const user = await authRepo.findByIdentifier(identifierInput);
    if (!user || !user.isActive)
      throw new ApiError(401, "Invalid credentials provided.");

    // 🔒 Security Guard block check
    if (!user.isPasswordSet) {
      throw new ApiError(
        403,
        "Account password configuration outstanding. Please follow the setup invitation link sent to your email.",
      );
    }

    const isMatch = await bcrypt.compare(
      passwordPlain,
      user.passwordHash || "",
    );
    if (!isMatch) throw new ApiError(401, "Invalid credentials provided.");

    user.lastLoginAt = new Date();
    await authRepo.save(user);

    const token = jwt.sign(
      { authId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    return { token, role: user.role };
  }
}
