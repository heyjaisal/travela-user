export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "your_upload_preset"); // ⬅️ Replace with your preset
  formData.append("cloud_name", "your_cloud_name");       // ⬅️ Replace with your Cloudinary name

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/auto/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      return {
        public_id: data.public_id,
        url: data.secure_url,
        resource_type: data.resource_type,
      };
    } else {
      throw new Error("Upload failed");
    }
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return null;
  }
};
