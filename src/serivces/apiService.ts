// src/services/apiService.ts
import { type ArmyResult } from '../modules/Army'
import { type Army } from '../modules/Army'
import { fetch } from '@tauri-apps/plugin-http'; // Импортируем Tauri fetch
//import { mockApiService } from './mockApiService'

const API_CONFIG = {
    baseURL: "http://192.168.56.1:8084/api", // Жестко заданный IP
    timeout: 10000
};

class ApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = API_CONFIG.baseURL;
    }

    private async request(endpoint: string) {
        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'GET', credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    async getArmies(searchNameArmy = '', classNameArmy = ''): Promise<ArmyResult> {
        const url = `/armies?searchNameArmy=${encodeURIComponent(searchNameArmy)}&class=${encodeURIComponent(classNameArmy)}`
        let res = this.request(url);
        console.log('Fetching from:', `${this.baseURL}${url}`);
        return res
    }

    async getArmyById(id: number): Promise<Army> {
        const url = `/army/${id}`;
        return this.request(url);
    }
}

export const apiService = new ApiService()