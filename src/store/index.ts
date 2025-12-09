import { configureStore } from '@reduxjs/toolkit'
import armiesReducer from './armiesSlice'
import historianReducer from './historianSlice'
import travelTimeReducer from './travelTimeSlice'

export const store = configureStore({
    reducer: {
        armies: armiesReducer,
        historian: historianReducer,
        travelTime: travelTimeReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch