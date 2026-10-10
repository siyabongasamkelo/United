import { useState, useEffect, useRef } from "react";
import { useUser } from "../../users/context/UserContext";
import { FleetAuditService } from "../services/fleetAuditService";
import { UploadService } from "../../../shared/services/uploadService"; // 🔗 Import Cloudinary pipe
import { api } from "../../../shared/api/axiosInstance"; // ⚡ Imported to pull your custom branch endpoint directly

// Simple local type definition matching your backend Store interface
interface IBranchStoreOption {
  _id: string;
  name: string;
  storeCode: string;
}

export function useFleetAuditForm() {
  const { currentUser } = useUser();

  // 🆕 CHANGED: Turned storeOptions into a reactive state array populated directly by the database API
  const [storeOptions, setStoreOptions] = useState<IBranchStoreOption[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState<boolean>(false);

  // 💾 HTML Input reference hook to trigger hidden file dialogs cleanly
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedStore, setSelectedStore] = useState<{
    storeId: string;
    storeName: string;
  } | null>(null);
  const [totalCount, setTotalCount] = useState<string>("");
  const [damagedCount, setDamagedCount] = useState<string>("");
  const [dirtyCount, setDirtyCount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false); // ⚡ Added loading indicator for CDN upload
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // 🆕 EFFORTLESS TRIGGER: Pull matching branch locations automatically on initialization
  useEffect(() => {
    if (currentUser?.branchId) {
      fetchBranchStores();
    }
  }, [currentUser]);

  const fetchBranchStores = async () => {
    setIsLoadingStores(true);
    try {
      // 🛰️ Fires straight into your clean new endpoint router
      const response = await api.get<{
        success: boolean;
        data: IBranchStoreOption[];
      }>("/stores/my-branch-stores");
      setStoreOptions(response.data.data);
    } catch (err: any) {
      console.error("Failed loading branch inventory mapping:", err);
      setFeedback({
        type: "error",
        msg: "Failed to dynamically populate store dropdown selection choices.",
      });
    } finally {
      setIsLoadingStores(false);
    }
  };

  /**
   * Intercepts local browser file selections and streams them straight to Cloudinary
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback(null);

    try {
      // 🚀 Direct stream to Cloudinary CDN!
      const secureCdnUrl = await UploadService.uploadImage(file);

      setUploadedImages((prev) => [...prev, secureCdnUrl]);
      setFeedback({
        type: "success",
        msg: "📸 Photo successfully uploaded and secured in Cloudinary.",
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        msg: err.message || "Failed to upload image to Cloudinary.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file selection input slot
    }
  };

  const removeImage = (index: number) =>
    setUploadedImages((p) => p.filter((_, i) => i !== index));

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!currentUser || !selectedStore || !totalCount) {
      setFeedback({
        type: "error",
        msg: "Failed: Missing store or user context credentials.",
      });
      return;
    }

    const total = parseInt(totalCount, 10);
    const damaged = damagedCount ? parseInt(damagedCount, 10) : 0;
    const dirty = dirtyCount ? parseInt(dirtyCount, 10) : 0;

    if (damaged + dirty > total) {
      setFeedback({
        type: "error",
        msg: `⚠️ Guard Check: Damaged (${damaged}) and dirty (${dirty}) exceed total (${total}).`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await FleetAuditService.submitAudit({
        auditDate: new Date().toISOString(),
        store: selectedStore.storeId,
        branch: currentUser.branchId || "651f1234567890abcdef0002", // Dynamically bound straight from the profile context node!
        company: "651f1234567890abcdef0003", // Shared corporate organization reference fallback
        metrics: { total, damaged, dirty },
        images: uploadedImages, // Array of actual live Cloudinary HTTPS string urls passed seamlessly!
        notes: notes.trim() || undefined,
      });

      console.log("🎉 AUDIT SUBMITTED:", result);

      setFeedback({
        type: "success",
        msg: `🎉 Audit recorded! Operational: ${result.metrics.operational} units.`,
      });
      setSelectedStore(null);
      setTotalCount("");
      setDamagedCount("");
      setDirtyCount("");
      setNotes("");
      setUploadedImages([]);
    } catch (err: any) {
      setFeedback({
        type: "error",
        msg: err.message || "Server connection execution failure.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentUser,
    storeOptions, // Returns the clean, freshly updated, live API options array!
    isLoadingStores, // Exposing loading flags for layout feedback indicators
    selectedStore,
    setSelectedStore,
    totalCount,
    setTotalCount,
    damagedCount,
    setDamagedCount,
    dirtyCount,
    setDirtyCount,
    notes,
    setNotes,
    uploadedImages,
    isSubmitting,
    isUploading, // Expose to freeze UI while upload is active
    feedback,
    setFeedback,
    fileInputRef,
    handleFileChange,
    removeImage,
    handleFormSubmit,
  };
}
