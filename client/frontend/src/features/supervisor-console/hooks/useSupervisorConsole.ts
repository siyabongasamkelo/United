import { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { ManagerConsoleService } from "../../manager-console/services/managerConsoleService";
import { api } from "../../../shared/api/axiosInstance";

export function useSupervisorConsole() {
  const clerk = useClerk();

  const [branchMeta, setBranchMeta] = useState<any | null>(null);
  const [liveData, setLiveData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🚀 Read the supervisor's branch metadata from their Clerk context attributes
  // Adjust 'publicMetadata' or 'unsafeMetadata' based on where you store the supervisor's branch identity mapping
  const supervisorBranchId =
    (clerk.user?.publicMetadata as any)?.branchId || "651f1234567890abcdef0001";

  useEffect(() => {
    if (supervisorBranchId) {
      loadSupervisorDashboard();
    }
  }, [supervisorBranchId]);

  const loadSupervisorDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // ❶ Pull the specific branch configurations & details
      // We hit your existing endpoint but bypass the list view array context
      const allBranches = await ManagerConsoleService.fetchAreaBranches(
        "651f1234567890abcdef0010",
      );
      const currentBranch = allBranches.find(
        (b) => b._id === supervisorBranchId,
      );

      if (currentBranch) {
        setBranchMeta(currentBranch);
      } else {
        // Safe placeholder fallback if the specific ID isn't returned in the standard area fetch
        setBranchMeta({
          name: "Assigned Facility Hub Terminal",
          branchCode: "BR-SUPER-01",
        });
      }

      // ❷ Instantly dispatch cross-talk metrics loading request for their branch
      const detailedMetrics =
        await ManagerConsoleService.fetchBranchLiveSummary(supervisorBranchId);
      setLiveData(detailedMetrics);
    } catch (err: any) {
      console.error("Supervisor Dashboard Sync failure:", err);
      setError(
        err.message ||
          "Failed to synchronize operational metrics for your branch.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    branchMeta,
    liveData,
    isLoading,
    error,
    refreshDashboard: loadSupervisorDashboard,
  };
}
