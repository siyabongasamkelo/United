import {
  UserRepository,
  IUserRepository,
} from "../repositories/UserRepository";
import {
  userPayloadValidationSchema,
  UserPayloadInput,
} from "../schemas/userValidation";
import { IUser } from "../models/User";
// ✅ Changed from AppError class to the createAppError functional factory
import { createAppError } from "../../../shared/middleware/errorMiddleware";
import { telemetry } from "../../../shared/telemetry/logger";

export interface IUserService {
  onboardOrSyncUser(payload: unknown): Promise<IUser>;
  getUserProfile(clerkId: string): Promise<IUser>;
  assignStoreToOperator(
    clerkId: string,
    storeId: string,
    storeName: string,
  ): Promise<IUser>;
  toggleUserOperationalStatus(
    clerkId: string,
    isActive: boolean,
  ): Promise<IUser>;
}

export class UserService implements IUserService {
  private userRepo: IUserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async onboardOrSyncUser(payload: unknown): Promise<IUser> {
    const startTime = performance.now();
    const validatedInput: UserPayloadInput =
      userPayloadValidationSchema.parse(payload);

    const formattedStores = validatedInput.assignedStores.map((store) => ({
      ...store,
      assignedAt: new Date(),
    }));

    const synchronizedUser = await this.userRepo.registerOrSyncUser(
      validatedInput.clerkId,
      validatedInput.email,
      {
        ...validatedInput,
        assignedStores: formattedStores,
      },
    );

    telemetry.info({
      event: "USER_SYNC_SUCCESS",
      clerkId: validatedInput.clerkId,
      role: validatedInput.role,
      durationMs: Math.round(performance.now() - startTime),
    });

    return synchronizedUser;
  }

  async getUserProfile(clerkId: string): Promise<IUser> {
    const user = await this.userRepo.getUserByClerkId(clerkId);

    // ✅ Updated to use the functional factory throw pattern
    if (!user) {
      throw createAppError(
        `Profile location lookup failed. User reference token match missing.`,
        404,
      );
    }

    return user;
  }

  async assignStoreToOperator(
    clerkId: string,
    storeId: string,
    storeName: string,
  ): Promise<IUser> {
    const user = await this.userRepo.getUserByClerkId(clerkId);

    // ✅ Updated to use the functional factory throw pattern
    if (!user)
      throw createAppError(
        "Target employee profile could not be verified.",
        404,
      );
    if (!user.isActive)
      throw createAppError(
        "Action denied. Cannot route retail targets to a suspended account.",
        422,
      );

    const updatedUser = await this.userRepo.assignStoreToPorter(
      clerkId,
      storeId,
      storeName,
    );
    if (!updatedUser)
      throw createAppError(
        "Failed to update system store destination indexes.",
        500,
      );

    telemetry.info({
      event: "STORE_ROUTING_ASSIGNED",
      clerkId,
      storeId,
      storeName,
    });
    return updatedUser;
  }

  async toggleUserOperationalStatus(
    clerkId: string,
    isActive: boolean,
  ): Promise<IUser> {
    const updatedUser = await this.userRepo.setAccountStatus(clerkId, isActive);

    // ✅ Updated to use the functional factory throw pattern
    if (!updatedUser)
      throw createAppError(
        "Account state modification request rejected or user missing.",
        404,
      );

    telemetry.warn({
      event: "USER_STATUS_TOGGLED",
      clerkId,
      status: isActive ? "ACTIVE" : "SUSPENDED",
    });
    return updatedUser;
  }
}
