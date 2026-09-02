const API_URL = process.env.API_URL || "http://localhost:3000/api";
const API_KEY = process.env.API_KEY || "";

export async function fetchServer<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  
  const headers = new Headers(options.headers);
  if (API_KEY) {
    headers.set("x-token", API_KEY);
  }
  
  // Only set Content-Type to application/json if not sending FormData
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Ignore JSON parse error if response is not JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
