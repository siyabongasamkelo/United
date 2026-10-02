import { AuthCredentials, IAuthCredentials } from "../models/auth.model.js";

export class AuthRepository {
  async findByIdentifier(value: string): Promise<IAuthCredentials | null> {
    return AuthCredentials.findOne({
      "identifiers.value": value.toLowerCase().trim(),
    });
  }

  async findBySetupToken(token: string): Promise<IAuthCredentials | null> {
    return AuthCredentials.findOne({
      accountSetupToken: token,
      accountSetupExpires: { $gt: new Date() },
    });
  }

  async findByVerificationToken(
    token: string,
  ): Promise<IAuthCredentials | null> {
    return AuthCredentials.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });
  }

  async create(data: Partial<IAuthCredentials>): Promise<IAuthCredentials> {
    return AuthCredentials.create(data);
  }

  async save(user: IAuthCredentials): Promise<IAuthCredentials> {
    return user.save();
  }
}
