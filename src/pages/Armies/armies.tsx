import { type FC, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Layout from '../../components/Layout/layout'
import ArmyCard from '../../components/ArmyCard/ArmyCard'
import { fetchArmies, setSearchName, setCountTT, setFilterAndSearch } from '../../store/armiesSlice'
import { type RootState } from '../../store'
import { useAppDispatch } from '../../hooks/redux'


const ArmiesPage: FC = () => {

    const dispatch = useAppDispatch()
    const { armies, searchName, classFilter, loading, countTT } = useSelector((state: RootState) => state.armies)

    const headerButtons = (
        <>
            <Link to="/" className="homeBTN redBTN">Главная</Link>
        </>
    )

    const handleSearch = () => {
        dispatch(fetchArmies({ searchName, classFilter }))
    }

    const handleFilterClick = (classNamer: string) => {
        dispatch(setFilterAndSearch(classNamer)) // Устанавливаем фильтр
        dispatch(fetchArmies({ searchName, classFilter: classNamer })) // Сразу выполняем поиск
    }

    const handleTTClick = () => {
        dispatch(setCountTT(0))
    }


    // Первоначальная загрузка
    useEffect(() => {
        dispatch(fetchArmies({ searchName, classFilter }))
    }, [dispatch])

    return (
        <Layout headerButtons={headerButtons}>
            <div className="wrapper"><a href="#" className="timesBTN redBTN" onClick={handleTTClick}>Расчёт <span className="homeBTNcount">{countTT}</span></a></div>
            <div className="wrapper">
                <h1>Виды войск и суточное расстояние</h1>

                {/* <div className="searchArmies">
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                        <input type="text" name="searchNameArmy" className="searchNameArmy" placeholder="Введите род войск"
                            value={searchNameArmyValue} onChange={(e) => setSearchNameArmyValue(e.target.value)} />
                        <Button className="redBTN searchBTN" onClick={() => handleSearch()}>Поиск</Button>
                    </form>
                </div> */}

                <div className="searchArmies">
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                        <input
                            type="text"
                            name="searchNameArmy"
                            className="searchNameArmy"
                            placeholder="Введите род войск"
                            value={searchName}
                            onChange={(e) => dispatch(setSearchName(e.target.value))}
                        />
                        <Button className="redBTN searchBTN" onClick={handleSearch}>
                            Поиск
                        </Button>
                    </form>
                </div>

                {/* <div className="filters">
                    <h2>ФИЛЬТРЫ:</h2>
                    <div className="filtersRow">
                        <form action="armies" method="get">
                            <button type="button" className="filterBTN active" id='all' onClick={() => { handleFilterClick("") }}>
                                Все
                            </button>
                            <button type="button" className="filterBTN" id='step' onClick={() => handleFilterClick("step")} >
                                Пешие
                            </button>
                            <button type="button" className="filterBTN" id='horse' onClick={() => handleFilterClick("horse")}>
                                Кавалерия
                            </button>
                            <button type="button" className="filterBTN" id='wheel' onClick={() => handleFilterClick("wheel")}>
                                Колёсные
                            </button>
                        </form>
                    </div>
                </div> */}

                <div className="filters">
                    <h2>ФИЛЬТРЫ:</h2>
                    <div className="filtersRow">
                        <form>
                            <button
                                type="button"
                                className={`filterBTN ${classFilter === '' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('')}
                            >
                                Все
                            </button>
                            <button
                                type="button"
                                className={`filterBTN ${classFilter === 'step' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('step')}
                            >
                                Пешие
                            </button>
                            <button
                                type="button"
                                className={`filterBTN ${classFilter === 'horse' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('horse')}
                            >
                                Кавалерия
                            </button>
                            <button
                                type="button"
                                className={`filterBTN ${classFilter === 'wheel' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('wheel')}
                            >
                                Колёсные
                            </button>
                        </form>
                    </div>
                </div>
                <div className="armies">
                    {loading ? (
                        <div>Загрузка...</div>
                    ) : (
                        <div className="cardRow">
                            {armies.map((item) => (
                                <ArmyCard key={item.ArmyID} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div >
        </Layout >
    )
}

export default ArmiesPage