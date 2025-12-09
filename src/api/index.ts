import { Api } from './Api';

const api = new Api({
    baseURL: '/api',
    // securityWorker: () => {
    //     const token = localStorage.getItem('jwt_token');
    //     if (token) {
    //         return {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         };
    //     }
    //     return {};
    // }
});

// // Добавляем перехватчик для токена
// api.instance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('jwt_token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Interceptor для обработки ответов (например, 401 ошибка)
// api.instance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Токен невалидный или просрочен
//             console.error('Не авторизован!');
//             // Можно перенаправить на страницу логина
//             // window.location.href = '/login';

//             // Или удалить токен
//             localStorage.removeItem('jwt_token');
//         }
//         return Promise.reject(error);
//     }
// );


export { api }