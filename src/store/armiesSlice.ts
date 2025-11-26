import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { type Army, type ArmyResult } from '../modules/Army'
import { mockArmies } from "../modules/armiesMock"

interface ArmiesState {
    armies: Army[]
    searchName: string
    classFilter: string
    loading: boolean
    error: string | null
    countTT: number
}

const initialState: ArmiesState = {
    armies: [],
    searchName: '',
    classFilter: '',
    loading: false,
    error: null,
    countTT: 0
}

// Async thunk для загрузки армий
export const fetchArmies = createAsyncThunk(
    'armies/fetchArmies',
    async ({ searchName = '', classFilter = '' }: { searchName?: string; classFilter?: string }) => {
        try {
            const response = await fetch(`/api/armies?searchNameArmy=${searchName}&class=${classFilter}`)
            if (!response.ok) throw new Error('Network response was not ok')
            return await response.json()
        } catch (error) {
            console.error('API request failed, using mock data:', error)
            if (searchName == "" && classFilter == "") return mockArmies
            let res: ArmyResult = {
                armies: []
            };
            if (searchName != "") {
                res.armies = mockArmies.armies.filter(army => army.NameArmy.includes(searchName));
                return res
            }
            if (classFilter != "") {
                res.armies = mockArmies.armies.filter(army => army.classNameArmy === classFilter)
                return res
            }
        }
    }
)

const armiesSlice = createSlice({
    name: 'armies',
    initialState,
    reducers: {
        setSearchName: (state, action: PayloadAction<string>) => {
            state.searchName = action.payload
        },
        setClassFilter: (state, action: PayloadAction<string>) => {
            state.classFilter = action.payload
        },
        setCountTT: (state, action: PayloadAction<number>) => {
            state.countTT = action.payload
        },
        resetFilters: (state) => {
            state.searchName = ''
            state.classFilter = ''
        },
        setFilterAndSearch: (state, action: PayloadAction<string>) => {
            state.classFilter = action.payload
            // Не устанавливаем loading здесь - это сделает fetchArmies.pending
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArmies.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchArmies.fulfilled, (state, action) => {
                state.loading = false
                state.armies = action.payload.armies
            })
            .addCase(fetchArmies.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch armies'
                state.armies = mockArmies.armies
            })
    }
})

export const { setSearchName, setClassFilter, setCountTT, resetFilters,
    setFilterAndSearch } = armiesSlice.actions
export default armiesSlice.reducer

