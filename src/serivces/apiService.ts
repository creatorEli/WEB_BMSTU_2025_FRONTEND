// // src/services/apiService.ts
// import { type Army, type ArmyResult } from '../modules/armiesMock'
// //import { mockApiService } from './mockApiService'
// import { config } from '../config'
// import { universalFetch } from '../modules/mockFetch'

// class ApiService {
//     async getArmies(searchNameArmy = '', classNameArmy = ''): Promise<ArmyResult> {
//         const url = `/api/armies?searchNameArmy=${encodeURIComponent(searchNameArmy)}&classNameArmy=${encodeURIComponent(classNameArmy)}`

//         const response = await universalFetch(url)

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         return await response.json()
//     }

//     async getArmyById(id: number): Promise<Army> {
//         const response = await universalFetch(`/api/armies/${id}`)

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         return await response.json()
//     }
// }

// export const apiService = new ApiService()