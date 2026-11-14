
import { API_BASE_URL } from "./api";

export async function getCyclePredictions(token) {
  const response = await fetch(
    `${API_BASE_URL}/tracking/predictions`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to retrieve cycle predictions"
    );
  }

  return data.predictions;
}
