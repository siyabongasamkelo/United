// united-trolley-frontend/src/shared/services/uploadService.ts

export class UploadService {
  private static CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  private static UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  /**
   * Uploads an image file to Cloudinary using unsigned upload
   * @param file - The image file to upload
   * @returns Promise<string> - The secure URL of the uploaded image
   */
  static async uploadImage(file: File): Promise<string> {
    // Validate environment variables
    if (!this.CLOUD_NAME || !this.UPLOAD_PRESET) {
      console.error("❌ Missing Cloudinary config!");
      console.error("CLOUD_NAME:", this.CLOUD_NAME);
      console.error("UPLOAD_PRESET:", this.UPLOAD_PRESET);
      throw new Error(
        "Missing Cloudinary configuration. Check your .env file for VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET",
      );
    }

    // Validate file
    if (!file) {
      throw new Error("No file provided for upload");
    }

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type: ${file.type}. Only images are allowed.`,
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(
        `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max size is 10MB.`,
      );
    }

    // Build the correct Cloudinary URL
    const url = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`;

    console.log("🚀 Starting Cloudinary upload...");
    console.log("📁 File:", file.name, `(${(file.size / 1024).toFixed(2)}KB)`);
    console.log("🔗 URL:", url);
    console.log("🎯 Preset:", this.UPLOAD_PRESET);

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", this.UPLOAD_PRESET);
    formData.append("folder", "fleet-audits"); // Optional: organize uploads

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will set it automatically with boundary
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Cloudinary error response:", errorData);

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error(
            `Unauthorized: Your upload preset "${this.UPLOAD_PRESET}" must be set to UNSIGNED in Cloudinary dashboard. Go to Settings → Upload → Upload presets → ${this.UPLOAD_PRESET} → Change Signing Mode to "Unsigned"`,
          );
        }

        throw new Error(
          errorData.error?.message ||
            `Upload failed with status ${response.status}: ${JSON.stringify(errorData)}`,
        );
      }

      const data = await response.json();
      console.log("✅ Upload successful!");
      console.log("🔗 Image URL:", data.secure_url);

      return data.secure_url;
    } catch (error: any) {
      console.error("💥 Upload failed:", error);

      // Re-throw with more context
      if (error.message.includes("fetch")) {
        throw new Error(
          "Network error: Could not connect to Cloudinary. Check your internet connection.",
        );
      }

      throw error;
    }
  }
}
