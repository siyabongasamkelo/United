// 📂 File: src/features/attendance/hooks/useStoreScan.ts
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { StoreVisitService } from "../services/storeVisitService";
import jsQR from "jsqr"; // 🚀 Imported the high-speed pixel text decoder!

export function useStoreScan() {
  const { getToken } = useAuth();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null); // Tracks the camera animation loop execution frame

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
          facingMode: "environment", // Enforces back camera use on mobile layouts
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
      });

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();

        // 🚨 START THE LIVE SCANNING DECODER LOOP!
        requestRef.current = requestAnimationFrame(tick);
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

  // 🎯 THE LIVE LENS TICK ENGINE: Grabs canvas snapshots of the video stream every frame
  const tick = () => {
    if (
      !videoRef.current ||
      videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA
    ) {
      requestRef.current = requestAnimationFrame(tick);
      return;
    }

    const video = videoRef.current;

    // Create an internal memory canvas layout matching the frame size exactly
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Parse pixels looking for a match container string
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      // If a code is detected and it looks like a valid 24-character Mongo ID payload block
      if (code && /^[0-9a-fA-F]{24}$/.test(code.data)) {
        console.log("🎯 QR Match Found in Frame Loop:", code.data);
        handleDecodedQR(code.data); // Lock it in and fire to backend!
        return; // Break loop execution cleanly
      }
    }

    // Continue scanning next video layout frame structure seamlessly
    requestRef.current = requestAnimationFrame(tick);
  };

  const stopCamera = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleDecodedQR = async (scannedStoreId: string) => {
    stopCamera();
    setIsSubmitting(true);
    setFeedback(null);

    try {
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
