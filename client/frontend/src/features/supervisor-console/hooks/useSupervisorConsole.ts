// 📂 File: src/features/supervisor-console/hooks/useSupervisorConsole.ts
import { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useUser } from "../../users/context/UserContext"; // 🚀 Imported your global context hook!
import { ManagerConsoleService } from "../../manager-console/services/managerConsoleService";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export function useSupervisorConsole() {
  const clerk = useClerk();

  // ❶ Read the unified MongoDB user profile directly from your context layer
  const { currentUser, isLoadingProfile } = useUser();

  const [branchMeta, setBranchMeta] = useState<any | null>(null);
  const [liveData, setLiveData] = useState<any | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ❷ Safely grab the branch ID mapped to this logged-in supervisor profile
  const supervisorBranchId = currentUser?.branchId;

  useEffect(() => {
    if (supervisorBranchId) {
      loadSupervisorDashboard(supervisorBranchId);
    }
  }, [supervisorBranchId]);

  const loadSupervisorDashboard = async (branchId: string) => {
    setIsLoadingMetrics(true);
    setError(null);
    try {
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (clerk.session) {
        const token = await clerk.session.getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
      }

      // ❸ Fetch the branch naming and structural details matching the supervisor's branch context
      const allBranches = await ManagerConsoleService.fetchAreaBranches(
        "651f1234567890abcdef0010",
      );
      const currentBranch = allBranches.find((b) => b._id === branchId);

      if (currentBranch) {
        setBranchMeta(currentBranch);
      } else {
        setBranchMeta({
          name: "Assigned Facility Hub Terminal",
          branchCode: "BR-SUPER-01",
        });
      }

      // ❹ Pull the single-table latest dynamic store fleet summaries using our final endpoint
      const response = await axios.get(
        `${BASE_URL}/managers-console/summary/${branchId}`,
        { headers },
      );

      console.log("managers console", response);

      if (response.data && response.data.data) {
        setLiveData(response.data.data);
      } else {
        setLiveData(null);
      }
    } catch (err: any) {
      console.error("Supervisor Dashboard Sync failure:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to synchronize operational metrics for your branch.",
      );
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  return {
    branchMeta,
    liveData,
    // Combine profile hydration state with explicit metrics loading state for smooth UI behavior
    isLoading: isLoadingProfile || isLoadingMetrics,
    error,
    refreshDashboard: () =>
      supervisorBranchId && loadSupervisorDashboard(supervisorBranchId),
  };
}
