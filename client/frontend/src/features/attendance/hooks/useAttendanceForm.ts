// 📂 File: src/features/attendance/hooks/useAttendanceForm.ts
import { useState, useEffect } from "react";
import { useUser } from "../../users/context/UserContext"; // 🚀 Reading your rich MongoDB profile provider
import { AttendanceService } from "../services/attendanceService";
import type { IAttendanceLogResponse } from "../services/attendanceService";

export function useAttendanceForm() {
  const { currentUser } = useUser();

  // Form Field States
  const [shiftWave, setShiftWave] = useState<string>("");
  const [hasSafetyBoots, setHasSafetyBoots] = useState<boolean>(false);
  const [hasReflectorVest, setHasReflectorVest] = useState<boolean>(false);
  const [hasSteeringRope, setHasSteeringRope] = useState<boolean>(false);

  // Status & History States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [historyLogs, setHistoryLogs] = useState<IAttendanceLogResponse[]>([]);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // Fetch logged shift events on initialization
  useEffect(() => {
    if (currentUser) {
      loadTodayLogs();
    }
  }, [currentUser]);

  const loadTodayLogs = async () => {
    try {
      const logs = await AttendanceService.getMyTodayLogs();
      setHistoryLogs(logs);
    } catch (err: any) {
      console.error("Failed to load logs:", err);
    }
  };

  const handleClockInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!currentUser) {
      setFeedback({
        type: "error",
        msg: "Missing user security profile context.",
      });
      return;
    }

    // 🚨 ARCHITECTURAL ENFORCEMENT CHECK: Guard against missing assignments
    if (!currentUser.branchId) {
      setFeedback({
        type: "error",
        msg: "⚠️ Profile Constraint Error: Your profile is not mapped to an active branch facility hub. Contact management.",
      });
      return;
    }

    // 💡 FIX: Save to a local variable. TypeScript now guarantees this is a strict 'string'
    const verifiedBranchId = currentUser.branchId;

    if (!shiftWave) {
      setFeedback({
        type: "error",
        msg: "Please select your target shift wave.",
      });
      return;
    }

    if (!hasSafetyBoots || !hasReflectorVest || !hasSteeringRope) {
      setFeedback({
        type: "error",
        msg: "⚠️ Compliance Block: All PPE and safety equipment declarations must be verified.",
      });
      return;
    }

    setIsSubmitting(true);

    if (!navigator.geolocation) {
      setFeedback({
        type: "error",
        msg: "GPS tracking is not supported or active on this device browser.",
      });
      setIsSubmitting(false);
      return;
    }

    // Enforce high-accuracy hardware geolocation sweeps
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // 🎯 DYNAMIC HOOK LINK: Using the guaranteed safe local variable
          await AttendanceService.clockIn({
            branchId: verifiedBranchId, // ◄ No more TS2322 null error!
            shiftWave: shiftWave as any,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            ppeDeclaration: {
              hasSafetyBoots,
              hasReflectorVest,
              hasSteeringRope,
            },
          });

          setFeedback({
            type: "success",
            msg: `🎉 Clock-in confirmed! Verified inside your branch geofence perimeter.`,
          });

          // Reset fields and refresh log history lists
          setShiftWave("");
          setHasSafetyBoots(false);
          setHasReflectorVest(false);
          setHasSteeringRope(false);
          await loadTodayLogs();
        } catch (err: any) {
          setFeedback({
            type: "error",
            msg:
              err.response?.data?.message ||
              err.message ||
              "Geofence execution connection error.",
          });
        } finally {
          setIsSubmitting(false);
        }
      },
      (error) => {
        setIsSubmitting(false);
        let errorMsg = "Unable to retrieve device GPS vectors.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg =
            "Location access denied. Please unlock permission controls in your system settings.";
        }
        setFeedback({ type: "error", msg: `⚠️ GPS Error: ${errorMsg}` });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return {
    currentUser,
    shiftWave,
    setShiftWave,
    hasSafetyBoots,
    setHasSafetyBoots,
    hasReflectorVest,
    setHasReflectorVest,
    hasSteeringRope,
    setHasSteeringRope,
    isSubmitting,
    feedback,
    historyLogs,
    handleClockInSubmit,
  };
}
