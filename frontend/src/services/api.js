const BASE_URL = '/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 401) {
            sessionStorage.setItem('auth_reason', 'expired');
            localStorage.clear();
            window.location.href = '/login';
        }
        let errorData = null;
        try {
            errorData = await response.json();
        } catch {
            // Keep UI messaging structured even when backend returns plain text/empty body.
            errorData = {
                code: String(response.status),
                message: response.statusText || 'Une erreur est survenue'
            };
        }
        if (!errorData || typeof errorData !== 'object') {
            errorData = {
                code: String(response.status),
                message: 'Une erreur est survenue'
            };
        }
        if (!errorData.status) {
            errorData.status = response.status;
        }
        throw errorData;
    }
    if (response.status === 204) return null;
    return response.json();
};

export const api = {
    get: async (endpoint) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    post: async (endpoint, body) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    put: async (endpoint, body) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    delete: async (endpoint) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};