export const config = {
    useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || !import.meta.env.VITE_API_URL,
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8084'
}