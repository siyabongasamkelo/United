import mongoose, { Schema, Document } from "mongoose";

export interface ILoginIdentifier {
  type: "email" | "staff_number" | "national_id";
  value: string;
}

export interface IAuthCredentials extends Document {
  identifiers: ILoginIdentifier[];
  passwordHash?: string; // Optional because pre-created admins/staff won't have a password yet
  role: "admin" | "staff" | "student";
  isActive: boolean;
  isEmailVerified: boolean;
  isPasswordSet: boolean; // 🔑 Crucial field tracking if setup is completed

  // Security tokens
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  accountSetupToken?: string; // Used for admin-created profiles
  accountSetupExpires?: Date;

  lastLoginAt?: Date;
}

const LoginIdentifierSchema = new Schema<ILoginIdentifier>({
  type: {
    type: String,
    enum: ["email", "staff_number", "national_id"],
    required: true,
  },
  value: { type: String, required: true, lowercase: true, trim: true },
});

const AuthCredentialsSchema = new Schema<IAuthCredentials>(
  {
    identifiers: [LoginIdentifierSchema],
    passwordHash: { type: String },
    role: { type: String, enum: ["admin", "staff", "student"], required: true },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    isPasswordSet: { type: Boolean, default: false },

    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    accountSetupToken: { type: String },
    accountSetupExpires: { type: Date },

    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

// Universal structural constraint enforcing unique login variables across the whole platform
AuthCredentialsSchema.index({ "identifiers.value": 1 }, { unique: true });
AuthCredentialsSchema.index({ emailVerificationToken: 1 });
AuthCredentialsSchema.index({ passwordResetToken: 1 });
AuthCredentialsSchema.index({ accountSetupToken: 1 });

export const AuthCredentials = mongoose.model<IAuthCredentials>(
  "Sys_Auth_Credentials",
  AuthCredentialsSchema,
);
