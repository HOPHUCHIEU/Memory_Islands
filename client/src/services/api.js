
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getMemories() {
  const response = await fetch(
    `${API_URL}/api/memories`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch memories");
  }

  return response.json();
}

export async function createMemory({
  image,
  message,
  date
}) {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("message", message);
  formData.append("date", date);

  const response = await fetch(
    `${API_URL}/api/memories`,
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.message || "Failed to create memory"
    );
  }

  return response.json();
}

export function getImageUrl(imageId) {
  return `${API_URL}/api/images/${imageId}`;
}
