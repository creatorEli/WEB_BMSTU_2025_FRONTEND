import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { mockArmies } from "../modules/armiesMock"
import { api } from '../api'
import { type DsArmy as Army } from '../api/Api'
interface ArmiesState {
    armies: Army[]
    searchName: string
    classFilter: string
    loading: boolean
    error: string | null
    countTT: number
    indexTT: number
}


interface ArmyResult {
    armies: Army[]
}

const initialState: ArmiesState = {
    armies: [],
    searchName: '',
    classFilter: '',
    loading: false,
    error: null,
    countTT: 0,
    indexTT: -1
}

// Async thunk для загрузки армий
export const fetchArmies = createAsyncThunk(
    'armies/fetchArmies',
    async ({ searchName = '', classFilter = '' }: { searchName?: string; classFilter?: string }) => {
        try {
            // const response = await fetch(`/api/armies?searchNameArmy=${searchName}&class=${classFilter}`)
            // if (!response.ok) throw new Error('Network response was not ok')
            // return await response.json()
            const res = await api.armies.armiesList({
                class: classFilter,           // фильтрация по классу
                searchNameArmy: searchName // поиск по названию
            })

            console.log("asking armies (4000)!")
            return res.data
        } catch (error) {
            console.error('API request failed, using mock data:', error)
            if (searchName == "" && classFilter == "") return mockArmies
            let res: ArmyResult = {
                armies: []
            };
            if (searchName != "") {
                res.armies = mockArmies.armies.filter((army: { NameArmy: string | string[] }) => army.NameArmy.includes(searchName));
                return res
            }
            if (classFilter != "") {
                res.armies = mockArmies.armies.filter((army: { classNameArmy: string }) => army.classNameArmy === classFilter)
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
            console.log("setCountTT worked!")
            state.countTT = action.payload
        },
        setIndexTT: (state, action: PayloadAction<number>) => {
            console.log("setIndexTT worked!")
            state.indexTT = action.payload
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
                console.log("fetchArmies.fulfilled: ", action.payload!.armies)
                if (action.payload!.armies?.length == 0) {
                    state.armies = mockArmies.armies
                } else
                    state.armies = action.payload!.armies
            })
            .addCase(fetchArmies.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch armies'
                state.armies = mockArmies.armies
            })
    }
})

export const { setSearchName, setClassFilter, setCountTT, setIndexTT, resetFilters,
    setFilterAndSearch } = armiesSlice.actions
export default armiesSlice.reducer

