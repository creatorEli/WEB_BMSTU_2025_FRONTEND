// // src/mocks/mockFetch.ts
// import { mockArmies } from './armiesMock'

// // Мок-реализация fetch
// const mockFetch = (url: string): Promise<Response> => {
//     return new Promise((resolve) => {
//         // Имитируем задержку сети
//         setTimeout(() => {
//             try {
//                 const urlObj = new URL(url, 'http://localhost:8084')
//                 const pathname = urlObj.pathname
//                 const searchParams = urlObj.searchParams

//                 // Обрабатываем запрос к армиям
//                 if (pathname === '/api/armies') {
//                     const searchNameArmy = searchParams.get('searchNameArmy') || ''
//                     const classNameArmy = searchParams.get('classNameArmy') || ''

//                     // Фильтруем мок-данные
//                     let filteredArmies = [...mockArmies.armies]

//                     // Фильтр по названию
//                     if (searchNameArmy) {
//                         filteredArmies = filteredArmies.filter(army =>
//                             army.NameArmy.toLowerCase().includes(searchNameArmy.toLowerCase())
//                         )
//                     }

//                     // Фильтр по классу
//                     if (classNameArmy) {
//                         filteredArmies = filteredArmies.filter(army =>
//                             army.classNameArmy === classNameArmy
//                         )
//                     }

//                     const response = new Response(JSON.stringify({ armies: filteredArmies }), {
//                         status: 200,
//                         headers: { 'Content-Type': 'application/json' }
//                     })
//                     resolve(response)
//                 }
//                 // Обрабатываем запрос к конкретной армии
//                 else if (pathname.startsWith('/api/armies/')) {
//                     const armyId = parseInt(pathname.split('/').pop() || '0')
//                     const army = mockArmies.armies.find( = army => a.ArmyID === armyId)

//                     if (army) {
//                         const response = new Response(JSON.stringify(army), {
//                             status: 200,
//                             headers: { 'Content-Type': 'application/json' }
//                         })
//                         resolve(response)
//                     } else {
//                         const response = new Response(JSON.stringify({ error: 'Армия не найдена' }), {
//                             status: 404,
//                             headers: { 'Content-Type': 'application/json' }
//                         })
//                         resolve(response)
//                     }
//                 }
//                 // Для всех остальных запросов возвращаем 404
//                 else {
//                     const response = new Response(JSON.stringify({ error: 'Not found' }), {
//                         status: 404,
//                         headers: { 'Content-Type': 'application/json' }
//                     })
//                     resolve(response)
//                 }
//             } catch (error) {
//                 const response = new Response(JSON.stringify({ error: 'Internal server error' }), {
//                     status: 500,
//                     headers: { 'Content-Type': 'application/json' }
//                 })
//                 resolve(response)
//             }
//         }, 300) // Задержка 300ms
//     })
// }

// // Функция для проверки, нужно ли использовать моки
// const shouldUseMock = () => {
//     return import.meta.env.VITE_USE_MOCK === 'true' ||
//         !import.meta.env.VITE_API_URL ||
//         window.location.hostname === 'localhost'
// }

// // Обертка над настоящим fetch
// export const universalFetch = (url: string, options?: RequestInit): Promise<Response> => {
//     if (shouldUseMock() && url.includes('/api/')) {
//         console.log(`🎭 Using mock fetch for: ${url}`)
//         return mockFetch(url)
//     }

//     // Используем настоящий fetch
//     return fetch(url, options)
// }