// Unsigned upload straight from the browser to Cloudinary — no backend
// needed, and no API secret exposed client-side. The "browser_upload"
// preset (mode: Unsigned) is what makes this safe to call with no auth.
const CLOUD_NAME = "dqu0ojnjp";
const UPLOAD_PRESET = "browser_upload";

export async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
    );

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(
            `Cloudinary upload failed (${response.status})${detail ? `: ${detail}` : ""}`,
        );
    }

    const data = await response.json();
    return data.secure_url;
}
