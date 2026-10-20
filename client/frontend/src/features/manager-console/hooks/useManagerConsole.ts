// 📂 File: src/features/manager-console/hooks/useManagerConsole.ts
import { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import type { IAreaBranchResponse } from "../services/managerConsoleService";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export function useManagerConsole(
  activeAreaId: string = "651f1234567890abcdef0005",
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
    if (!isOperatorLoggedIn) return;
    loadConsoleData();
  }, [activeAreaId, isOperatorLoggedIn]);

  const loadConsoleData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (clerk.session) {
        const token = await clerk.session.getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get(`${BASE_URL}/stores/area-branches`, {
        params: { areaId: activeAreaId },
        headers,
      });

      if (response.data && response.data.data) {
        setBranches(response.data.data);
      } else {
        setBranches([]);
      }
    } catch (err: any) {
      console.error("Manager Console Sync failure:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load live provincial terminal data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 REDIRECTING THIS CALL TO TARGET THE FINAL BOSS MANAGERS-CONSOLE ENDPOINT
  const loadBranchDetailedSummary = async (branchId: string) => {
    setIsLoadingSummary(true);
    try {
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (clerk.session) {
        const token = await clerk.session.getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
      }

      console.log("branchId", branchId);

      // 🎯 Directly targeting the newly created router path gateway on the backend
      const response = await axios.get(
        `${BASE_URL}/managers-console/summary/${branchId}`,
        { headers },
      );

      console.log("managers console", response);

      if (response.data && response.data.data) {
        setLiveBranchSummary(response.data.data);
      } else {
        setLiveBranchSummary(null);
      }
    } catch (err: any) {
      console.error("Failed to load managers-console summary data:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch live branch console metrics.",
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
