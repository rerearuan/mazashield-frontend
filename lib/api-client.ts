const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type FetchOptions = RequestInit & {
    params?: Record<string, string>;
};

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...init } = options;

    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const headers = new Headers(init.headers);
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
        ...init,
        headers,
    });

    if (response.status === 204) {
        return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
        let errorMessage = data.message || data.error || data.detail;

        if (!errorMessage && typeof data === 'object') {
            // Handle DRF validation errors like { field: [error] }
            const firstKey = Object.keys(data)[0];
            if (firstKey && Array.isArray(data[firstKey])) {
                errorMessage = `${firstKey}: ${data[firstKey][0]}`;
            } else if (firstKey) {
                errorMessage = `${firstKey}: ${JSON.stringify(data[firstKey])}`;
            }
        }

        throw {
            status: response.status,
            message: errorMessage || "Terjadi kesalahan pada server",
            errors: data,
        };
    }

    return data;
}
