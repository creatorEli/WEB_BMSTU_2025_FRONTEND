import { type FC, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Layout from '../../components/Layout/layout'
import ArmyCard from '../../components/ArmyCard/ArmyCard'
import { fetchArmies, setSearchName, setCountTT, setIndexTT, setFilterAndSearch } from '../../store/armiesSlice'
import { type RootState } from '../../store'
import { useAppDispatch } from '../../hooks/redux'
import { logoutUserAsync } from '../../store/historianSlice'
import { api } from '../../api';

const ArmiesPage: FC = () => {

    const dispatch = useAppDispatch()
    const { armies, searchName, classFilter, loading, countTT, indexTT } = useSelector((state: RootState) => state.armies)
    const { username, isAuthenticated } = useSelector((state: RootState) => state.historian);

    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log("handleLogout")
        try {
            await dispatch(logoutUserAsync()).unwrap();
            console.log("Выход успешен, перенаправляем на главную...");
            navigate('/');
        } catch (error) {
            console.error("Ошибка при выходе:", error);
            // Все равно перенаправляем, очищаем локально
            navigate('/');
        }
    };

    const headerButtons = (
        <>
            <Link to="/" className="homeBTN redBTN">Главная</Link>
            {isAuthenticated ? (
                <>
                    <Link to="/travel_times" className="homeBTN redBTN">Все расчёты</Link>
                    <Link to="/historian_lks" className="homeBTN redBTN">Профиль ({username})</Link>
                    <button
                        className='redBTN homeBTN'
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                    >
                        Выход
                    </button>
                </>
            ) : (
                <>
                    <Link to="/auth" className="homeBTN redBTN">Вход</Link>
                    <Link to="/reg" className="homeBTN redBTN">Регистрация</Link>
                </>
            )}
        </>
    )

    const handleSearch = () => {
        dispatch(fetchArmies({ searchName, classFilter }))
    }

    const handleFilterClick = (classNamer: string) => {
        dispatch(setFilterAndSearch(classNamer)) // Устанавливаем фильтр
        dispatch(fetchArmies({ searchName, classFilter: classNamer })) // Сразу выполняем поиск
    }

    const checkTravelTimeBTN = async () => {
        //console.log("isAuthenticated, загружаем расчеты...")
        // Загружаем список расчетов
        if (isAuthenticated) {
            await api.travelTime.travelTimeList()
                .then(response => {
                    console.log("Инфа о расчёте кнопке: ", response.data)
                    dispatch(setCountTT(response.data.CountArmies))
                    dispatch(setIndexTT(response.data.TTid))
                    console.log("countTT = ", countTT)
                    console.log("indexTT = ", indexTT)
                })
                .catch(error => {
                    //console.error("Ошибка загрузки информации о расчёте:", error)
                    //Если ошибка 401(Unauthorized) - токен истек
                    if (error.response?.status === 401) {
                        // Автоматически разлогиниваем
                        dispatch(logoutUserAsync());
                    }
                    if (error.response?.status === 404) {
                        console.log("404 worked: ", error.response.data)
                        dispatch(setIndexTT(error.response.data.TTid))
                        dispatch(setCountTT(error.response.data.CountArmies))
                    }
                });
        } else {
            console.log("checkTravelTimeBTN, NOT Authenticated!")
            // тут добавить 
        }
    }


    // В родительском компоненте (списке армий)
    const handleArmyAdded = () => {
        console.log('Армия добавлена в черновик')
        checkTravelTimeBTN()
    }

    // Первоначальная загрузка
    useEffect(() => {
        console.log("useEffect ArmiesPage")
        dispatch(fetchArmies({ searchName, classFilter }))
        checkTravelTimeBTN()
    }, [dispatch])
    //console.log(armies)
    return (
        <Layout headerButtons={headerButtons}>
            <div className="wrapper"><Link to={(indexTT == -1) ? "#" : "/travel_time/" + indexTT} className={(indexTT == -1) ? "blockedTimesBTN" : "timesBTN"} ><img src="./../src/resources/images/icon_draft.svg"></img><span className="homeBTNcount">{countTT}</span></Link></div>
            <div className="wrapper">
                <h1>Виды войск и суточное расстояние</h1>

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
                            {
                                armies.map((item) => (
                                    <ArmyCard key={item.ArmyID} item={item} onAddSuccess={handleArmyAdded} />
                                ))
                            }
                        </div>
                    )}
                </div>
            </div >
        </Layout >
    )
}

export default ArmiesPage