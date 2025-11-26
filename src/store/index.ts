import { configureStore } from '@reduxjs/toolkit'
import armiesReducer from './armiesSlice'

export const store = configureStore({
    reducer: {
        armies: armiesReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch