// file: services/api.ts
const BASE_URL = "https://elementortemplates.in/wp-json/custom-api/v1";

/**
 * Upload an image to WordPress
 */
// services/api.ts
export async function uploadImageAsync(uri: string) {
  const filename = uri.split("/").pop() || "upload.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image/jpeg`;

  const formData = new FormData();

  // 👇 Correct field name must be "file" (matches your PHP $_FILES['file'])
  formData.append("file", {
    uri,
    name: filename,
    type,
  } as any);

  const res = await fetch("https://elementortemplates.in/wp-json/custom-api/v1/upload", {
    method: "POST",
    headers: {
      // DO NOT set Content-Type manually → let fetch set correct boundary
      Accept: "application/json",
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Upload failed");
  }

  return res.json(); // { url, id }
}


/**
 * Save review for uploaded image
 */
export async function saveReview(data: {
  project_id: string;
  check_id: string;
  check_label: string;
  image_id: number;
  image_url: string;
  status: "pass" | "fail";
}) {
  const res = await fetch(`${BASE_URL}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Save review failed");
  return res.json();
}

/**
 * Fetch all reviews for a project
 */
export async function fetchReviews(projectId: string) {
  const res = await fetch(`${BASE_URL}/reviews?project_id=${projectId}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json(); // Array of { project_id, check_id, image_url, status, ... }
}

/**
 * Mark project as completed (store + notify)
 */
export async function markProjectCompleted(data: {
  project_id: string;
  project_name: string;
  user_id: string;
  name: string;
  email: string;
}) {
  const res = await fetch(`${BASE_URL}/completed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to complete project");
  }

  return res.json();
}
