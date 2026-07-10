import { getToken, removeToken, removeUser } from "@/lib/auth";
const PROXY_URL = "/api/";

interface ApiOptions extends RequestInit {
  body?: any;
  responseType?: "json" | "blob";
}

export async function callApi<T = any>(
  endpoint: string,
  {
    body,
    headers: customHeaders,
    responseType = "json",
    ...customConfig
  }: ApiOptions = {},
): Promise<T> {
  if (
    body?.password &&
    (endpoint === "auth/login" || endpoint === "auth/google") &&
    !(body instanceof FormData)
  ) {
    try {
      body = {
        ...body,
        password: atob(body.password),
      };
    } catch (e) {
      console.error("Invalid password");
    }
  }
  const token = getToken();
  const isFormData = body instanceof FormData;

  const headers: HeadersInit = {
    ...(body && !isFormData && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customHeaders,
  };

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${PROXY_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        if (!window.location.pathname.includes("/login")) {
          removeToken();
          removeUser();

          const Swal = (await import("sweetalert2")).default;

          await Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "OK",
            didClose: () => {
              window.location.href = "/login";
            },
          });
          return {} as T;
        }
      }
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message:
          errorBody.message ||
          errorBody.error?.error ||
          errorBody.error ||
          "An error occurred",
        error: errorBody.error,
      };
    }

    if (response.status === 204) return {} as T;
    if (responseType === "blob") {
      return (await response.blob()) as unknown as T;
    }

    return await response.json();
  } catch (error) {
    console.error("API Call Failed:", error);
    throw error;
  }
}

export function callSSE(
  endpoint: string,
  options?: {
    onOpen?: () => void;
    onError?: (error: any) => void;
  },
) {
  const API_URL = process.env.API_BASE_URL || "http://localhost:3001";

  const url = `${API_URL}/${endpoint.replace(/^\/+/, "")}`;

  const eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.log("SSE connected:", url);
    options?.onOpen?.();
  };

  eventSource.onerror = (err) => {
    console.error("SSE Error", err);
    options?.onError?.(err);
  };

  return eventSource;
}
