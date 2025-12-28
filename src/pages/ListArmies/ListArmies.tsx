import { type FC, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Layout from '../../components/Layout/layout'
import ArmyCard from '../../components/ArmyCard/ArmyCard'
import { fetchArmies, setSearchName, setCountTT, setIndexTT, setPage, setIndexation, setFilterAndSearch } from '../../store/armiesSlice'
import { type RootState } from '../../store'
import { useAppDispatch } from '../../hooks/redux'
import { logoutUserAsync } from '../../store/historianSlice'
import { api } from '../../api';

const ListArmies: FC = () => {
    const dispatch = useAppDispatch()
    const { armies, searchName, classFilter, loading, countTT, indexTT, total, totalPages, page, queryTimeMS, queryWithIndexes } = useSelector((state: RootState) => state.armies)
    const { username, isAuthenticated, historian } = useSelector((state: RootState) => state.historian);

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
        dispatch(fetchArmies({ searchName, classFilter, page, withIndexationn: queryWithIndexes }))
    }

    const handleDeleteArmy = async (armyID: number) => {
        try {
            const response = await api.army.armyDelete(armyID)
            console.log(response);
            alert("Армия удалена!")
            dispatch(fetchArmies({ searchName, classFilter, page, withIndexationn: queryWithIndexes }))
        }
        catch (error: any) {
            console.error('Ошибка добавления в расчёт:', error)
            if (error.response?.status === 401) {
                alert('Сессия истекла. Пожалуйста, войдите снова.')
                setTimeout(() => navigate('/auth'), 2000)
            } else if (error.response?.status === 500) {
                alert('Ошибка при удалении армии!')
            } else {
                alert('Не удалось удалить армию')
            }
        }
    }

    const handlePaginatorClick = (pageNumber: number) => {
        console.log(pageNumber)
        dispatch(setPage(pageNumber))
        dispatch(fetchArmies({ searchName, classFilter, page: pageNumber, withIndexationn: queryWithIndexes }))
    }

    // Первоначальная загрузка
    useEffect(() => {
        if (!isAuthenticated || historian?.Role != 1) {
            console.log("NOT Authenticated")
            navigate('/forbidden');
        }
        dispatch(fetchArmies({ searchName, classFilter }))
    }, [dispatch])

    console.log(armies)

    return (
        <Layout headerButtons={headerButtons}>
            <div className="wrapper">
                <h1>Список Армий</h1>

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
                <Link to="/add_army"
                    className="redBTN addArmyBTN"
                    onClick={() => { }}
                >Добавить Армию</Link>

                <div className='paginator'>
                    {/* Всего страниц {totalPages}; Текущая страница {page} <br /> */}
                    <button
                        className='redBTN'
                        onClick={() => {
                            handlePaginatorClick(1)
                        }
                        }
                        disabled={page === 1}
                    >
                        В начало
                    </button>
                    <button
                        className='redBTN'
                        onClick={() => {
                            let res = Math.max(1, page - 1)
                            handlePaginatorClick(res)
                        }
                        }
                        disabled={page === 1}
                    >
                        Назад
                    </button>

                    <span>Страница {page} из {totalPages}</span>

                    <button
                        className='redBTN'
                        onClick={() => {
                            let res = Math.min(totalPages, page + 1)
                            handlePaginatorClick(res)
                        }}
                        disabled={page === totalPages}
                    >
                        Вперед
                    </button>
                    <button
                        className='redBTN'
                        onClick={() => {
                            handlePaginatorClick(totalPages)
                        }}
                        disabled={page === totalPages}
                    >
                        В конец
                    </button>
                </div>
                <p className="smallArmiesPageInfo">
                    Всего результатов: {total}; Время выполнения: {queryTimeMS} мс. <input type='checkbox' checked={queryWithIndexes} onClick={(e) => dispatch(setIndexation(e.target.checked))} />Индексация
                </p>
                <div className="ArmiesList">
                    {loading ? (
                        <div>Загрузка...</div>
                    ) : (
                        <table>
                            {/* <div className="cardRow">
                                {
                                    armies.map((item) => (
                                        <ArmyCard key={item.ArmyID} item={item} onAddSuccess={handleArmyAdded} />
                                    ))
                                }
                            </div> */}
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Название</th>
                                    <th>Скорость<br />равнина</th>
                                    <th>Скорость<br />Горы/холмы</th>
                                    <th>Скорость<br />Лес</th>
                                    <th>Скорость<br />Река</th>
                                    <th>Скорость<br />Пустыня</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    armies!.map((army) => {
                                        //const army = item.Army;
                                        //if (army.StatusArmy != "удален")
                                        return (
                                            <tr>
                                                <th>{army.ArmyID}</th>
                                                {/* <th><img src={army.ImageArmyUrl} alt=" image" /></th> */}
                                                <th><h3>{army.NameArmy}</h3></th>
                                                <th>{army.MinPlainSpeed} - {army.MaxPlainSpeed} км</th>
                                                <th>{army.MinMountSpeed} - {army.MaxMountSpeed} км</th>
                                                <th>{army.MinForestSpeed} - {army.MaxForestSpeed} км</th>
                                                <th>{army.MinRiverSpeed} - {army.MaxRiverSpeed} км</th>
                                                <th>{army.MinDesertSpeed} - {army.MaxDesertSpeed} км</th>
                                                <th>
                                                    <div className="atcButtons">
                                                        {/* <button
                                                            className="redBTN atcBTN"
                                                            onClick={() => { }}
                                                        >Изменить</button> */}

                                                        <Link className='redBTN atcBTN' to={`/moderate_army/${army.ArmyID}`}>Изменить</Link>
                                                        <button
                                                            className="redBTN atcBTN"
                                                            onClick={() => { handleDeleteArmy(army.ArmyID) }}
                                                        >
                                                            Удалить
                                                        </button></div></th>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    )}
                </div>
            </div >
        </Layout >
    )
}

export default ListArmies