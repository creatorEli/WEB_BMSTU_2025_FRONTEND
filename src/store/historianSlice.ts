import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { type DsHistorian, type HandlerMesHisLPMSw, type HandlerLoginResp } from '../api/Api';


interface UserState {
    username: string;
    isAuthenticated: boolean;
    token?: string | null;
    historian?: DsHistorian | null;
    error?: string | null;
}

const initialState: UserState = {
    username: '',
    isAuthenticated: false,
    token: null,
    historian: null,
    error: null,
};



// Асинхронное действие для авторизации
export const loginUserAsync = createAsyncThunk(
    'user/loginUserAsync',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            console.log("loginUserAsync: Начинаем авторизацию для", credentials.username);

            const response = await api.historian.authCreate({
                loginHistorian: credentials.username,
                passwordHistorian: credentials.password
            })

            console.log("loginUserAsync: Ответ получен, статус:", response.status);
            console.log("loginUserAsync: Данные ответа:", response.data);

            let data: HandlerMesHisLPMSw = {};
            data.historian = response.data.Historian as DsHistorian;
            data.message = response.data.Message as HandlerLoginResp
            console.log("data = ", data)

            // Детальный лог структуры данных
            console.log("loginUserAsync: data.historian:", data.historian);
            console.log("loginUserAsync: data.historian?.login:", data.historian?.login);
            console.log("loginUserAsync: data.message:", data.message);
            console.log("loginUserAsync: data.message?.access_token:", data.message?.access_token);


            if (data.message?.access_token) {
                // Сохраняем токен
                const token = data.message.access_token;
                //localStorage.setItem('jwt_token', token);

                // Устанавливаем токен в заголовки axios для будущих запросов
                api.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                console.log("loginUserAsync: Токен получен и сохранен");

                console.log(data)
                // Возвращаем данные для сохранения в состоянии
                return {
                    token: token,
                    historian: data.historian,
                    message: data.message
                };
            } else {
                console.log("loginUserAsync: Токен не найден в ответе");
                throw new Error('Токен не получен');
            }

        } catch (error: any) {
            console.log("loginUserAsync: Ошибка в catch:", error);
            console.log("loginUserAsync: Сообщение ошибки:", error.message);
            console.log("loginUserAsync: Ответ сервера:", error.response?.data);
            return rejectWithValue('Ошибка авторизации'); // Возвращаем ошибку в случае неудачи
        }
    }
);

// Асинхронное действие для обновления данных историка
export const updateHistorianAsync = createAsyncThunk(
    'user/updateHistorianAsync',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.historian.historianUpdate({
                loginHistorian: credentials.username,
                passwordHistorian: credentials.password
            });

            const data = response.data as { historian?: DsHistorian };

            if (data.historian) {
                return data.historian;
            } else {
                throw new Error('Данные историка не получены');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка обновления данных');
        }
    }
);

// Асинхронное действие для деавторизации
export const logoutUserAsync = createAsyncThunk(
    'user/logoutUserAsync',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.historian.exitCreate();

            // Удаляем токен
            //localStorage.removeItem('jwt_token');
            delete api.instance.defaults.headers.common['Authorization'];

            return response.data;
        } catch (error: any) {
            // Все равно очищаем данные при выходе
            //localStorage.removeItem('jwt_token');
            delete api.instance.defaults.headers.common['Authorization'];
            return rejectWithValue(error.response?.data?.message || 'Ошибка при выходе из системы');
        }
    }
);


// Проверка авторизации при загрузке приложения (только если есть токен в состоянии)
export const checkAuthAsync = createAsyncThunk(
    'user/checkAuthAsync',
    async (_, { getState, rejectWithValue }) => {
        try {
            // Получаем текущее состояние
            const state = getState() as { user: UserState };
            const token = state.user.token;

            if (!token) {
                console.log("Токен не найден в состоянии Redux!");
                localStorage.removeItem('jwt_token');
                throw new Error('Пользователь не авторизован');
            }

            // Токен уже должен быть установлен в заголовках из состояния
            // Но на всякий случай проверяем
            if (!api.instance.defaults.headers.common['Authorization']) {
                api.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            // Проверяем валидность токена, получая данные пользователя
            const response = await api.historian.historianList();

            // Обрабатываем ответ (может быть с большой буквы)
            const data = response.data as { Historian?: DsHistorian };

            return {
                token,
                historian: data.Historian
            };
        } catch (error: any) {
            // Очищаем невалидный токен
            localStorage.removeItem('jwt_token');
            delete api.instance.defaults.headers.common['Authorization'];
            return rejectWithValue(error.response?.data?.message || 'Сессия недействительна');
        }
    }
);

const historianSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUserAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(loginUserAsync.fulfilled, (state, action) => {
                const { token, historian } = action.payload;
                if (historian && historian.login) {
                    state.username = historian.login;
                    state.historian = historian;
                    state.token = token;
                    state.isAuthenticated = true;
                    state.error = null;
                    localStorage.setItem("jwt_token", token)

                } else {
                    state.error = 'Ошибка авторизации: некорректные данные';
                    console.log("loginUserAsync.fulfilled: Историк не найден в ответе");
                }
            })
            .addCase(loginUserAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.historian = null;
                state.token = null;
                console.log("loginUserAsync.rejected: Ошибка авторизации:", action.payload);
            })


            .addCase(logoutUserAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(logoutUserAsync.fulfilled, (state) => {
                state.username = '';
                state.isAuthenticated = false;
                state.historian = null;
                state.token = null;
                state.error = null;
            })
            .addCase(logoutUserAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                // Все равно очищаем состояние при ошибке выхода
                state.username = '';
                state.isAuthenticated = false;
                state.historian = null;
                state.token = null;
            })


            .addCase(checkAuthAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(checkAuthAsync.fulfilled, (state, action) => {
                const { token, historian } = action.payload;

                if (historian && historian.login) {
                    state.username = historian.login;
                    state.historian = historian;
                    state.token = token;
                    state.isAuthenticated = true;
                    state.error = null;
                } else {
                    console.log("checkAuthAsync.fulfilled: Историк не найден в ответе");
                    state.error = 'Сессия недействительна';
                    state.isAuthenticated = false;
                    state.historian = null;
                    state.token = null;
                }
            })
            .addCase(checkAuthAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.historian = null;
                state.token = null;
            })



            .addCase(updateHistorianAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(updateHistorianAsync.fulfilled, (state, action) => {
                state.historian = action.payload;
                state.username = action.payload.login || '';
                state.error = null;
            })
            .addCase(updateHistorianAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = historianSlice.actions;
export default historianSlice.reducer;