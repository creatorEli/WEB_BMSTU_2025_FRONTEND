const API_CONFIG = {
    baseURL: 'http://localhost:8084/api',

    // Функция для получения токена из localStorage
    getToken: () => localStorage.getItem('jwt_token'),

    // Общие заголовки
    headers: {
        'Content-Type': 'application/json',
    }
}

export const apiRequest = async (url, options = {}) => {
    const token = API_CONFIG.getToken()

    const headers = {
        ...API_CONFIG.headers,
        ...options.headers,
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
}