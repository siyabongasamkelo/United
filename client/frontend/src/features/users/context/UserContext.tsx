import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { configureAxiosInterceptors } from "../../../shared/api/axiosInstance";
import { useUser as ClerkUseUser } from "@clerk/clerk-react";
import { UserService, type IUserProfile } from "../services/userService";
import { useSession } from "@clerk/clerk-react";

interface IUserContextType {
  currentUser: IUserProfile | null;
  isLoadingProfile: boolean;
  profileError: string | null;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<IUserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ❶ Grab explicit loading and identity states directly from Clerk's core hook
  const { isLoaded, isSignedIn, user } = ClerkUseUser();
  const { session } = useSession();

  const [currentUser, setCurrentUser] = useState<IUserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Wrap inside useCallback to prevent recursive render loops
  const hydrateProfile = useCallback(async () => {
    console.log("📡 [UserContext] Hydration sequence initiated...");
    console.log(
      `🔍 [UserContext] Clerk Status -> isLoaded: ${isLoaded}, isSignedIn: ${isSignedIn}, ClerkUserID: ${user?.id}`,
    );

    if (!isLoaded) {
      console.log(
        "⏳ [UserContext] Waiting for Clerk SDK to finish initializing...",
      );
      return;
    }

    if (!isSignedIn || !user) {
      console.log(
        "🛑 [UserContext] No user is logged in via Clerk. Skipping profile fetch.",
      );
      setCurrentUser(null);
      return;
    }

    setIsLoadingProfile(true);
    setProfileError(null);

    try {
      console.log(
        `🚀 [UserContext] Attempting HTTP request to local server for profile lookup...`,
      );
      const profile = await UserService.getUserProfile();

      console.log(
        "✅ [UserContext] SUCCESS! Profile synchronized from MongoDB:",
        profile,
      );
      setCurrentUser(profile);
    } catch (error: any) {
      console.error("💥 [UserContext] CRITICAL SERVER FETCH FAILED:", error);
      setProfileError(
        error.message || "Failed to fetch operational database profile.",
      );
      setCurrentUser(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [isLoaded, isSignedIn, user]);

  // ❷ Automatically trigger on state shifts
  useEffect(() => {
    if (isSignedIn && session) {
      console.log(
        "⚙️ [UserContext] Attaching secure session interceptors to global Axios client...",
      );

      // 🚀 Pass your live Clerk session straight into your interceptor engine!
      configureAxiosInterceptors(session);

      // Now run our server profile fetch safely with secure headers attached
      hydrateProfile();
    } else {
      setCurrentUser(null);
      setIsLoadingProfile(false);
    }
  }, [isSignedIn, session, hydrateProfile]);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoadingProfile,
        profileError,
        refreshProfile: hydrateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(
      "useUser must be evaluated within a valid architectural UserProvider gate.",
    );
  }
  return context;
};
