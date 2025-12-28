// store/travelTimeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import {
    type DsTravelTime,
    type HandlerTtToresultsStrPlusArmies,
    type HandlerUpdaterTT,
    type HandlerIdDraftCountArmies,
    type DsArmy
} from '../api/Api';

export interface TravelTimeState {
    travelTimes: DsTravelTime[];
    currentTravelTime: HandlerTtToresultsStrPlusArmies | null;
    draftInfo: HandlerIdDraftCountArmies | null;
    loading: boolean;
    error: string | null;
}

const initialState: TravelTimeState = {
    travelTimes: [],
    currentTravelTime: null,
    draftInfo: null,
    loading: false,
    error: null,
};

// Получение списка всех расчетов с фильтрацией
export const fetchTravelTimes = createAsyncThunk(
    'travelTime/fetchTravelTimes',
    async (params: {
        dateFromTT?: string;
        dateToTT?: string;
        statusTT?: string
    }, { rejectWithValue }) => {
        try {
            const response = await api.travelTimes.travelTimesList(params);
            console.log("список расчётов: ", response.data.travel_times)
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки расчетов');
        }
    }
);

// // Получение информации о черновике текущего пользователя
// export const fetchDraftInfo = createAsyncThunk(
//     'travelTime/fetchDraftInfo',
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await api.travelTime.travelTimeList();
//             console.log("черновик Текущего юзера: ", response)
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data?.message || 'Ошибка получения информации о черновике');
//         }
//     }
// );

// Получение детальной информации о расчете по ID
export const fetchTravelTimeById = createAsyncThunk(
    'travelTime/fetchTravelTimeById',
    async (ttid: number, { rejectWithValue }) => {
        try {
            const response = await api.travelTime.travelTimeDetail(ttid);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки расчета');
        }
    }
);

// Обновление полей расчета
export const updateTravelTimeFields = createAsyncThunk(
    'travelTime/updateTravelTimeFields',
    async ({
        ttid,
        data
    }: {
        ttid: number;
        data: HandlerUpdaterTT
    }, { rejectWithValue }) => {
        try {
            const response = await api.travelTime.travelTimeUpdate(ttid, data);
            console.log("обновлённые поля расчёта: ", response)
            return { ttid, data: response.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка обновления расчета');
        }
    }
);

// Удаление армии из расчета
export const deleteArmyFromTravelTime = createAsyncThunk(
    'travelTime/deleteArmyFromTravelTime',
    async ({
        ttid,
        armyId
    }: {
        ttid: number;
        armyId: number
    }, { rejectWithValue }) => {
        try {
            const response = await api.travelTime.deleteArmyDelete({
                TTid: ttid,
                ArmyID: armyId,
            });
            console.log("удаленная армия из расчёта: ", response)
            return { ttid, armyId, message: response.data.message };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка удаления армии из расчета');
        }
    }
);

// Обновление летописных сведений для армии в расчете
export const updateArmyChronical = createAsyncThunk(
    'travelTime/updateArmyChronical',
    async ({
        ttid,
        armyId,
        newKmPerDayChronical
    }: {
        ttid: number;
        armyId: number;
        newKmPerDayChronical: number
    }, { rejectWithValue }) => {
        try {
            const response = await api.travelTime.updateArmyUpdate({
                TTid: ttid,
                ArmyID: armyId,
                newKmPerDayChronical: newKmPerDayChronical,
            });
            console.log("обновлённые летописные сведения для армии в расчёте: ", response)
            return { ttid, armyId, newKmPerDayChronical, message: response.data.message };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка обновления летописных сведений');
        }
    }
);

// Формирование расчета (проверка обязательных полей)
export const formTravelTime = createAsyncThunk(
    'travelTime/formTravelTime',
    async (ttid: number, { rejectWithValue }) => {
        try {
            console.log("formTravelTime")
            const response = await api.travelTime.formUpdate(ttid);
            console.log("формирование расчёта: ", response)
            return response.data;
        } catch (error: any) {
            if (error.code)
                return rejectWithValue(error.response.data.messaage);
        }
    }
);

// Удаление расчета (смена статуса на "удален")
export const deleteTravelTime = createAsyncThunk(
    'travelTime/deleteTravelTime',
    async (ttid: number, { rejectWithValue }) => {
        try {
            const response = await api.travelTime.travelTimeDelete(ttid);
            console.log("удаление расчёта: ", response)
            return { ttid, message: response.data.message };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка удаления расчета');
        }
    }
);

// Модерация расчета (завершить/отклонить) !!! ПРОВЕРИТЬ ПОТОМ!
export const moderateTravelTime = createAsyncThunk(
    'travelTime/moderateTravelTime',
    async ({
        ttid,
        statusTT
    }: {
        ttid: number;
        statusTT: 'завершен' | 'отклонен'
    }, { rejectWithValue }) => {
        try {
            const response = await api.travelTime.moderateUpdate(
                ttid.toString(),
                {
                    ttid: ttid,
                    statusTT: statusTT,
                }
            );
            console.log("moderateTravelTime: ", response.data)
            return { ttid, data: response.data };
        } catch (error: any) {
            console.log("Ошибка модерации расчёта! ", error.response)
            // alert("Ошибка модерации расчёта: " error.response)
            return rejectWithValue(error.response?.data?.message || 'Ошибка модерации расчета');
        }
    }
);

const travelTimeSlice = createSlice({
    name: 'travelTime',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentTravelTime: (state) => {
            state.currentTravelTime = null;
        },
        clearDraftInfo: (state) => {
            state.draftInfo = null;
        },
        // Синхронное действие для обновления данных расчета (если нужно без запроса к API)
        // updateTravelTimeLocal: (state, action: PayloadAction<{
        //     ttid: number;
        //     data: Partial<DsTravelTime>;
        // }>) => {
        //     const { ttid, data } = action.payload;

        //     // Обновляем в списке
        //     state.travelTimes = state.travelTimes.map(tt =>
        //         tt.TtID === ttid ? { ...tt, ...data } : tt
        //     );

        //     // Обновляем текущий расчет
        //     if (state.currentTravelTime?.time_travel.ttID === ttid) {
        //         state.currentTravelTime.time_travel = {
        //             ...state.currentTravelTime.time_travel,
        //             ...data
        //         };
        //     }
        // },
    },
    extraReducers: (builder) => {
        builder
            // fetchTravelTimes
            .addCase(fetchTravelTimes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTravelTimes.fulfilled, (state, action) => {
                state.loading = false;
                state.travelTimes = action.payload;
            })
            .addCase(fetchTravelTimes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })




            // // fetchDraftInfo
            // .addCase(fetchDraftInfo.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(fetchDraftInfo.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.draftInfo = action.payload;
            // })
            // .addCase(fetchDraftInfo.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.payload as string;
            // })





            // fetchTravelTimeById
            .addCase(fetchTravelTimeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTravelTimeById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTravelTime = action.payload;
            })
            .addCase(fetchTravelTimeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })





            // updateTravelTimeFields
            .addCase(updateTravelTimeFields.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTravelTimeFields.fulfilled, (state, action) => {
                state.loading = false;
                const { ttid, data } = action.payload;
                console.log("updateTravelTimeFields = ", state.travelTimes)
                // Обновляем в списке
                // console.log(state.travelTimes)
                // state.travelTimes.travel_times = state.travelTimes.travel_times.map(tt =>
                //     tt.TtID === ttid ? { ...tt, ...data } : tt
                // );

                // Обновляем текущий расчет
                if (state.currentTravelTime?.time_travel!.ttID === ttid) {
                    state.currentTravelTime.time_travel = {
                        ...state.currentTravelTime.time_travel,
                        ...data
                    };
                }
            })
            .addCase(updateTravelTimeFields.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })



            // deleteArmyFromTravelTime
            .addCase(deleteArmyFromTravelTime.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteArmyFromTravelTime.fulfilled, (state, action) => {
                state.loading = false;
                const { ttid, armyId } = action.payload;

                // Удаляем армию из текущего расчета
                if (state.currentTravelTime?.time_travel!.ttID === ttid) {
                    state.currentTravelTime.list_armies =
                        state.currentTravelTime.list_armies?.filter(army => army.Army.ArmyID !== armyId);
                }
            })
            .addCase(deleteArmyFromTravelTime.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })



            // updateArmyChronical - неиспользуется 
            .addCase(updateArmyChronical.fulfilled, (state, action) => {
                //const { ttid, armyId, newKmPerDayChronical } = action.payload;

                console.log(".addCase updateArmyChronical")

                // Обновляем летописные сведения в текущем расчете
                // Примечание: это поле находится в DsTravelTime, но если нужно обновить что-то другое,
                // нужно будет добавить соответствующую логику
            })



            // formTravelTime
            .addCase(formTravelTime.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(formTravelTime.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTravelTime = action.payload;

                // Обновляем в списке
                console.log("state.travelTimes = ", state.travelTimes)
                // state.travelTimes.travel_times = state.travelTimes.travel_times.map(tt =>
                //     tt.TtID === updatedTravelTime.TtID ? updatedTravelTime : tt
                // );

                // Обновляем текущий расчет
                if (state.currentTravelTime?.time_travel!.ttID === updatedTravelTime.TtID) {
                    state.currentTravelTime!.time_travel = {
                        ...state.currentTravelTime!.time_travel,
                        ...updatedTravelTime
                    };
                }
            })
            .addCase(formTravelTime.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })




            // deleteTravelTime
            .addCase(deleteTravelTime.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTravelTime.fulfilled, (state, action) => {
                state.loading = false;
                const { ttid } = action.payload;

                // Удаляем из списка
                //state.travelTimes = state.travelTimes.filter(tt => tt.TtID !== ttid);

                // Очищаем текущий расчет если это он
                if (state.currentTravelTime?.time_travel!.ttID === ttid) {
                    state.currentTravelTime = null;
                }
            })
            .addCase(deleteTravelTime.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })





            // moderateTravelTime
            .addCase(moderateTravelTime.fulfilled, (state, action) => {
                const { ttid, data } = action.payload;

                // Обновляем в списке
                state.travelTimes.travel_times = state.travelTimes.travel_times.map(tt =>
                    tt.TtID === ttid ? { ...tt, ...data.travel_time } : tt
                );

                // Обновляем текущий расчет
                if (state.currentTravelTime?.time_travel!.ttID === ttid) {
                    state.currentTravelTime.time_travel = {
                        ...state.currentTravelTime.time_travel,
                        ...data.travel_time
                    };
                }
            });
    },
});

export const {
    clearError,
    clearCurrentTravelTime,
    clearDraftInfo,
    //updateTravelTimeLocal
} = travelTimeSlice.actions;

export default travelTimeSlice.reducer;








// import { createSlice, createAsyncThunk, type PayloadAction, asyncThunkCreator } from '@reduxjs/toolkit'
// import { mockArmies } from "../modules/armiesMock"
// import { api } from '../api'
// import { type DsArmy as Army } from '../api/Api'
// import { type DsTravelTime as TravelTime } from '../api/Api'
// interface DraftState {
//     armies: Army[]
//     travelTime: TravelTime | null
// }

// const initialState: DraftState = {
//     armies: [],
//     travelTime: null
// }

// export const getTravelTimeDraft = createAsyncThunk(
//     'travelTime/getDraft',
//     async (credentials: { ttid: number }, { rejectWithValue }) => {
//         try {
//             const response = await api.travelTime.travelTimeDetail(credentials.ttid)
//             console.log(response)
//         } catch (error: any) {
//             console.log("getTravelTimeDraft ошибка: ", error)
//         }
//     }
// )

// const TravelTimeDraftSlice = createSlice{
//     name: 'travelTime',

// }
