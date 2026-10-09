import { useState, useEffect, useRef } from "react";
import { useUser } from "../../users/context/UserContext";
import { FixReportService } from "../services/fixReportService";
import { StoreService } from "../services/storeService";
import type { IStoreResponse } from "../services/storeService";
import { UploadService } from "../../../shared/services/uploadService";

const componentMapping: Record<
  string,
  "CASTOR_WHEELS" | "BACK_GATE" | "CHASSIS_FRAME" | "ROPE_STEER_MOUNT" | "OTHER"
> = {
  "Castor Wheels": "CASTOR_WHEELS",
  "Back-Gate": "BACK_GATE",
  Chassis: "CHASSIS_FRAME",
  "Rope Mount": "ROPE_STEER_MOUNT",
  "Other / Frame": "OTHER",
};

const severityMapping: Record<string, "LOW" | "MEDIUM" | "HIGH"> = {
  Low: "LOW",
  Medium: "MEDIUM",
  High: "HIGH",
};

export function useFixReportForm(onSuccessCallback?: () => void) {
  const { currentUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Core Data Capture States
  const [trolleyId, setTrolleyId] = useState<string>("");
  const [liveStores, setLiveStores] = useState<IStoreResponse[]>([]); // ⚡ Holds live seeded records
  const [selectedStore, setSelectedStore] = useState<IStoreResponse | null>(
    null,
  ); // ⚡ Type-safe store model bind
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null,
  );
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  // System Pipelines
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoadingStores, setIsLoadingStores] = useState<boolean>(true); // ⚡ Loading tracker
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // ⚡ Sync stores straight out of the live Atlas database on focus
  useEffect(() => {
    async function loadBranchStores() {
      try {
        setIsLoadingStores(true);
        const storesData = await StoreService.getMyBranchStores();
        setLiveStores(storesData);
      } catch (err: any) {
        console.error("Failed to sync seeded store registers:", err);
      } finally {
        setIsLoadingStores(false);
      }
    }
    if (currentUser) {
      loadBranchStores();
    }
  }, [currentUser]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback(null);

    try {
      const secureCdnUrl = await UploadService.uploadImage(file);
      setUploadedImageUrl(secureCdnUrl);
      setFeedback({
        type: "success",
        msg: "📸 Damaged structural evidence photo successfully attached.",
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        msg: err.message || "Failed to upload image.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => setUploadedImageUrl("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (
      !currentUser ||
      !selectedStore ||
      !selectedComponent ||
      !selectedSeverity
    ) {
      setFeedback({
        type: "error",
        msg: "Operational Error: Missing mandatory choices.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await FixReportService.submitFaultReport({
        trolleyId: trolleyId.trim().toUpperCase(),
        storeOriginId: selectedStore._id, // ⚡ Maps straight to the real seeded mongo _id reference key!
        brokenComponent: componentMapping[selectedComponent] || "OTHER",
        damageSeverity: severityMapping[selectedSeverity] || "LOW",
        notes: notes.trim() || undefined,
        evidenceImageUrl: uploadedImageUrl || undefined,
      });

      setFeedback({
        type: "success",
        msg: `⚙️ ${trolleyId.toUpperCase()} logged successfully into the maintenance queue.`,
      });

      setTrolleyId("");
      setSelectedStore(null);
      setSelectedComponent(null);
      setSelectedSeverity(null);
      setNotes("");
      setUploadedImageUrl("");

      if (onSuccessCallback) onSuccessCallback();
    } catch (err: any) {
      setFeedback({
        type: "error",
        msg: err.message || "Network transmission failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentUser,
    liveStores,
    isLoadingStores,
    trolleyId,
    setTrolleyId,
    selectedStore,
    setSelectedStore,
    selectedComponent,
    setSelectedComponent,
    selectedSeverity,
    setSelectedSeverity,
    notes,
    setNotes,
    uploadedImageUrl,
    isSubmitting,
    isUploading,
    feedback,
    fileInputRef,
    handleFileChange,
    removeImage,
    handleFormSubmit,
  };
}
