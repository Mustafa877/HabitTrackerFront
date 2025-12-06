const API_URL = "http://91.121.231.195:1003/api";

export const api = {
    async get(endpoint: string, token?: string) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                "Authorization": token ? `Bearer ${token}` : "",
            },
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async post(endpoint: string, body: any, token?: string) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            // Try to parse JSON error, fallback to text
            try {
                const err = await res.json();
                throw new Error(err.message || err.title || "Error");
            } catch (e: any) {
                throw new Error(e.message || await res.text());
            }
        }
        return res.json();
    },

    async put(endpoint: string, body: any, token?: string) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    async delete(endpoint: string, token?: string) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "DELETE",
            headers: {
                "Authorization": token ? `Bearer ${token}` : "",
            },
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }
};
