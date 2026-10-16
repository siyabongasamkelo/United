import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { StoreVisitService } from "../services/storeVisitService";

export function useStoreScan() {
  // ⚡ Grab the raw token acquisition engine straight from the edge auth node
  const { getToken } = useAuth();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
    delta?: number;
  } | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setFeedback(null);
    setIsScanning(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
      });

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setFeedback({
        type: "error",
        msg: "Failed to allocate camera stream video frame channels. Verify hardware selections.",
      });
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  /**
   * Triggered immediately when a QR code match is parsed
   */
  const handleDecodedQR = async (scannedStoreId: string) => {
    stopCamera();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      // 🚀 THE RACE CONDITION FIX: Proactively check if Clerk can yield a token right now.
      // If the token resolves, Clerk is hydrated and ready. No infinite page lock necessary!
      const activeToken = await getToken();

      if (!activeToken) {
        setFeedback({
          type: "error",
          msg: "🔒 Authentication session rehydrating. Please wait a moment and try scanning again.",
        });
        setIsSubmitting(false);
        return;
      }

      if (!navigator.geolocation) {
        setFeedback({
          type: "error",
          msg: "Hardware Telemetry Error: Browser software missing location extraction frameworks.",
        });
        setIsSubmitting(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            const response = await StoreVisitService.submitStoreScan({
              storeId: scannedStoreId,
              latitude,
              longitude,
            });

            setFeedback({
              type: response.success ? "success" : "error",
              msg: response.message,
              delta: response.data.distanceDelta,
            });
          } catch (err: any) {
            setFeedback({
              type: "error",
              msg:
                err.response?.data?.message ||
                "Server verification pipeline connectivity crash.",
            });
          } finally {
            setIsSubmitting(false);
          }
        },
        (error) => {
          console.error("GPS lock failed:", error);
          setFeedback({
            type: "error",
            msg: "🛰️ GPS Tracking Required: Enable device location capabilities to verify store sweep presence.",
          });
          setIsSubmitting(false);
        },
        { enableHighAccuracy: true, timeout: 8000 },
      );
    } catch (authError) {
      setFeedback({
        type: "error",
        msg: "Security handshaking failed. Refresh the terminal window to sync profiles.",
      });
      setIsSubmitting(false);
    }
  };

  return {
    videoRef,
    isScanning,
    isSubmitting,
    feedback,
    startCamera,
    stopCamera,
    handleDecodedQR,
  };
}
