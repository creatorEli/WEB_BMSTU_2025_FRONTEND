import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { mockArmies } from "../modules/armiesMock"
import { api } from '../api'
import { type DsArmy as Army } from '../api/Api'
import { act } from 'react'
interface ArmiesState {
    armies: Army[]
    searchName: string
    classFilter: string
    loading: boolean
    error: string | null
    countTT: number
    indexTT: number
    queryTimeMS: number
    limit: number
    page: number
    total: number
    totalPages: number
    queryWithIndexes: boolean
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
    indexTT: -1,
    queryTimeMS: 0,
    limit: 0,
    page: 0,
    total: 0,
    totalPages: 0,
    queryWithIndexes: false
}

// Async thunk для загрузки армий
export const fetchArmies = createAsyncThunk(
    'armies/fetchArmies',
    async ({ searchName = '', classFilter = '', page = 1, withIndexationn = false }: { searchName?: string; classFilter?: string, page?: number, withIndexationn?: boolean }) => {
        try {
            // const response = await fetch(`/api/armies?searchNameArmy=${searchName}&class=${classFilter}`)
            // if (!response.ok) throw new Error('Network response was not ok')
            // return await response.json()
            const res = await api.armies.armiesList({
                class: classFilter,           // фильтрация по классу
                searchNameArmy: searchName, // поиск по названию
                page: String(page),
                withIndexation: withIndexationn
            })

            console.log("asking armies (4000)!")
            console.log(res.data)
            return res.data
        } catch (error) {
            console.error('API request failed, using mock data!')
            console.log('mock data: ', mockArmies.armies)
            let res: ArmyResult = {
                armies: []
            };
            if (searchName == "" && classFilter == "") {
                res.armies = mockArmies.armies.filter((army: { classNameArmy: string }) => army.classNameArmy === classFilter);
                console.log("res in default = ", res)
                return res
            }
            if (searchName != "") {
                res.armies = mockArmies.armies.filter((army: { NameArmy: string | string[] }) => army.NameArmy.includes(searchName));
                return res
            }
            if (classFilter != "") {
                res.armies = mockArmies.armies.filter((army: { classNameArmy: string }) => army.classNameArmy === classFilter)
                console.log("res in classFilter = ", res)
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
        setIndexation: (state, action: PayloadAction<boolean>) => {
            console.log("indexation = ", action.payload)
            state.queryWithIndexes = action.payload
        },
        setClassFilter: (state, action: PayloadAction<string>) => {
            state.classFilter = action.payload
        },
        setCountTT: (state, action: PayloadAction<number>) => {
            console.log("setCountTT worked!")
            state.countTT = action.payload
        },
        setIndexTT: (state, action: PayloadAction<number>) => {
            state.indexTT = action.payload
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
            console.log("state.page = ", state.page)
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
                //console.log("fetchArmies.fulfilled: ", action.payload!.data)
                if (action.payload!.armies?.length == 0) {
                    console.warn("got in extraReducers Mock!")
                    state.armies = mockArmies.armies
                } else {
                    //Object { Armies: (12) […], Pagination: {…}, QueryTimeMs: 178, QueryWithIndex: false }
                    state.armies = action.payload!.Armies
                    state.queryTimeMS = action.payload!.QueryTimeMs
                    state.queryWithIndexes = action.payload!.QueryWithIndex
                    state.total = action.payload!.Pagination.Total
                    state.limit = action.payload!.Pagination.Limit
                    state.page = action.payload!.Pagination.Page
                    state.totalPages = action.payload!.Pagination.TotalPages
                }
            })
            .addCase(fetchArmies.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch armies'
                state.armies = mockArmies.armies
            })
    }
})

export const { setSearchName, setClassFilter, setCountTT, setIndexTT, resetFilters,
    setFilterAndSearch, setIndexation, setPage } = armiesSlice.actions
export default armiesSlice.reducer

