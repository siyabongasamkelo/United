import { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import type { IAreaBranchResponse } from "../services/managerConsoleService";
import axios from "axios";

// 💡 Isolated instance just for this feature desk to protect your global configurations
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
    if (!isOperatorLoggedIn) {
      return;
    }
    loadConsoleData();
  }, [activeAreaId, isOperatorLoggedIn]);

  const loadConsoleData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // 🚀 Explicitly fetch the token here to ensure no race conditions happen
      if (clerk.session) {
        const token = await clerk.session.getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      // 💡 Direct clean network request bypassing global interceptors safely
      const response = await axios.get(`${BASE_URL}/stores/area-branches`, {
        params: { areaId: activeAreaId },
        headers,
      });

      // Safely unpack the backend database data dialect layout
      if (response.data && response.data.data) {
        setBranches(response.data.data);
      } else {
        setBranches([]);
      }
    } catch (err: any) {
      console.error("Manager Console Sync failure:", err);
      // Safely capture message regardless of custom interceptor formatting variations
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to load live provincial terminal data.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBranchDetailedSummary = async (branchId: string) => {
    setIsLoadingSummary(true);
    try {
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (clerk.session) {
        const token = await clerk.session.getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      // 💡 Direct clean request tracking path parameters explicitly
      const response = await axios.get(
        `${BASE_URL}/stores/branch-deep-dive/${branchId}`,
        { headers },
      );

      // Unpack the deep nested data payload context smoothly
      if (response.data && response.data.data) {
        setLiveBranchSummary(response.data.data);
      } else {
        setLiveBranchSummary(null);
      }
    } catch (err: any) {
      console.error("Failed to load deep-dive data:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch live branch dashboard tracking data.";
      setError(msg);
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
