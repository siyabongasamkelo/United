// 📂 File: src/features/manager-console/hooks/useManagerConsole.ts
import { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import type { IAreaBranchResponse } from "../services/managerConsoleService";
import { ManagerConsoleService } from "../services/managerConsoleService";
import { api } from "../../../shared/api/axiosInstance";

export function useManagerConsole(
  activeAreaId: string = "651f1234567890abcdef0010",
) {
  const clerk = useClerk();

  const [branches, setBranches] = useState<IAreaBranchResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] =
    useState<IAreaBranchResponse | null>(null);
  const [liveBranchSummary, setLiveBranchSummary] = useState<any | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);

  const isOperatorLoggedIn = !!clerk.session && !!clerk.user?.id;

  useEffect(() => {
    if (!isOperatorLoggedIn) {
      return;
    }
    loadConsoleData();
  }, [activeAreaId, isOperatorLoggedIn]);

  const loadConsoleData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 🚀 THE BLOCKING HANDSHAKE: Force the engine to wait for Clerk's token to be fully ready
      if (clerk.session) {
        const token = await clerk.session.getToken();
        // Force-apply it to our active instance header layout to beat the interceptor race condition
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const data = await ManagerConsoleService.fetchAreaBranches(activeAreaId);
      setBranches(data);
    } catch (err: any) {
      console.error("Manager Console Sync failure:", err);
      setError(err.message || "Failed to load live provincial terminal data.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadBranchDetailedSummary = async (branchId: string) => {
    setIsLoadingSummary(true);
    try {
      // 🚀 THE BLOCKING HANDSHAKE: Enforce token readiness on drill-down click actions too
      if (clerk.session) {
        const token = await clerk.session.getToken();
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const response = await api.get(`/stores/branch-deep-dive/${branchId}`);
      setLiveBranchSummary(response.data.data);
    } catch (err: any) {
      console.error("Failed to load deep-dive data:", err);
      setError(
        err.message || "Failed to fetch live branch dashboard tracking data.",
      );
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return {
    branches,
    isLoading,
    error,
    selectedBranch,
    setSelectedBranch,
    liveBranchSummary,
    isLoadingSummary,
    loadBranchDetailedSummary,
    clearSelectedBranch: () => {
      setSelectedBranch(null);
      setLiveBranchSummary(null);
    },
    refreshConsole: loadConsoleData,
  };
}
