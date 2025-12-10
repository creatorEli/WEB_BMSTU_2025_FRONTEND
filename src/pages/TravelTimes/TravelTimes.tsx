import { type FC, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { type RootState } from '../../store'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/layout'
import { useAppDispatch } from '../../hooks/redux'
import { api } from '../../api';
import { logoutUserAsync } from '../../store/historianSlice';
import type { DsTravelTime } from '../../api/Api';
import { fetchTravelTimes, deleteTravelTime, clearError, moderateTravelTime } from '../../store/travelTimeSlice';


const TravelTimesPage: FC = () => {

    //const [tts, setTTs] = useState<DsTravelTime[]>([])
    const { username, isAuthenticated, historian } = useSelector((state: RootState) => state.historian);
    //const { armies, searchName, classFilter, loading, countTT } = useSelector((state: RootState) => state.armies)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    let { travelTimes, loading, error } = useSelector((state: RootState) => state.travelTime);

    const today = new Date()
    console.log(`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`)

    const [filters, setFilters] = useState({
        statusTT: '',
        dateFromTT: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
        dateToTT: ''
    });

    // Функция для форматирования даты
    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return '—';

        try {
            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                return dateString;
            }
            if (date.getFullYear() == 1) {
                return '-'
            }

            return new Intl.DateTimeFormat('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                timeZone: 'Europe/Moscow'
            }).format(date);
        } catch {
            return dateString || '—';
        }
    };
    // Используем useMemo для создания отформатированных данных
    const formattedTravelTimes = useMemo(() => {
        if (!travelTimes.travel_times || !Array.isArray(travelTimes.travel_times)) return [];

        return travelTimes.travel_times.map(item => ({
            ...item,
            // Создаем новые поля для отформатированных дат, не изменяя оригинальные
            formattedDateCreateTT: formatDate(item.DateCreateTT),
            formattedDateUpdateTT: formatDate(item.DateUpdateTT),
            formattedDateFinishTT: formatDate(item.DateFinishTT),
            // Для отладки можно также сохранить полную дату с временем
        }));
    }, [travelTimes]);

    //console.log("formattedTravelTimes = ", formattedTravelTimes)

    const intervalRef = useRef<number | null>(null);
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchTravelTimes(filters));
            // setFilters({
            //     statusTT: '',
            //     dateFromTT: '',
            //     dateToTT: ''
            // })
            // Устанавливаем интервал
            if (username == "moder") {
                intervalRef.current = setInterval(() => {
                    dispatch(fetchTravelTimes(filters));
                }, 5000);

                // Очищаем интервал при размонтировании
                return () => {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                };
            }
        } else {
            console.log("NOT Authenticated (travel time)")
            navigate('/auth');
        }
    }, [isAuthenticated, dispatch, navigate, filters]);

    const handleDeclineTT = async (ttid: number) => {
        try {
            const res = await dispatch(moderateTravelTime({
                ttid: ttid,
                statusTT: "отклонен"
            })).unwrap();

            console.log("handleDeclineTT = ", res)
        } catch (error: any) {
            alert(`Ошибка, не удалось отклонить расчёт! - ${error}`);
        }
    }

    const handleApproveTT = async (ttid: number) => {
        try {
            const res = await dispatch(moderateTravelTime({
                ttid: ttid,
                statusTT: "завершен"
            })).unwrap();

            console.log("handleDeclineTT = ", res)
        } catch (error: any) {
            alert(`Ошибка, не удалось завершить расчёт! - ${error}`);
        }
    }

    const handleLogout = async () => {
        try {
            await dispatch(logoutUserAsync()).unwrap();
            navigate('/');
        } catch (error) {
            console.error("Ошибка при выходе:", error);
            navigate('/');
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // const handleDeleteTravelTime = async (ttid: number, e: React.MouseEvent) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     if (window.confirm('Вы уверены, что хотите удалить этот расчет?')) {
    //         try {
    //             await dispatch(deleteTravelTime(ttid)).unwrap();
    //             // После удаления можно показать сообщение об успехе
    //             alert('Расчет успешно удален');
    //         } catch (error: any) {
    //             alert(`Ошибка удаления: ${error}`);
    //         }
    //     }
    // };



    const headerButtons = (
        <>
            <Link to="/" className="homeBTN redBTN">Главная</Link>
            <Link to="/armies" className="homeBTN redBTN">Все армии</Link>
            {isAuthenticated ? (
                <>
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
                <Link to="/auth" className="homeBTN redBTN">Вход</Link>
            )}
        </>
    )

    return (
        <Layout headerButtons={headerButtons}>
            <div className="wrapper" >
                <h1>Расчёты (завершённых - {formattedTravelTimes.filter(item => item.StatusTT == "завершен").length})</h1>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                        <button
                            type="button"
                            className="btn-close float-end"
                            onClick={() => dispatch(clearError())}
                            aria-label="Close"
                        ></button>
                    </div>
                )}
                <div className="params">
                    <form className="formTTsParams">
                        <div className="TTsParam">
                            <label>Статус заявки</label>
                            {/* <!--черновик, удален, сформирован, завершен, отклонен--> */}
                            <select
                                name="statusTT"
                                value={filters.statusTT}
                                onChange={handleFilterChange}
                            >
                                <option value="" selected>Любой статус</option>
                                {/* <option value="черновик">черновик</option>
                                <option value="удален">удален</option> */}
                                <option value="сформирован">сформирован</option>
                                <option value="завершен">завершен</option>
                                <option value="отклонен">отклонен</option>
                            </select>
                        </div>

                        <div className="TTsParam">
                            <label>Дата начала</label>
                            <input
                                type="date"
                                name="dateFromTT"
                                value={filters.dateFromTT}
                                // value="2022-11-11"
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="TTsParam">
                            <label>Дата окончания</label>
                            <input
                                type="date"
                                name="dateToTT"
                                value={filters.dateToTT}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </form>
                </div>

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </div>
                    </div>
                ) : (
                    <div className="TravelTimesList">
                        {travelTimes.length === 0 ? (
                            <div className="alert alert-info">
                                {Object.values(filters).some(f => f)
                                    ? 'Расчеты по заданным фильтрам не найдены'
                                    : 'У вас пока нет расчетов'}
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Статус</th>
                                        <th>Дата создания</th>
                                        <th>Дата формирования</th>
                                        <th>Дата завершения</th>
                                        <th>Пройденное<br />расстояние</th>
                                        <th>Мин.<br />дней</th>
                                        <th>Макс.<br />дней</th>
                                        <th>Летописн.<br />дней</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(formattedTravelTimes) ? (formattedTravelTimes.map((item) => (
                                        // {(travelTimes.travel_times) ? (travelTimes.travel_times.map((item) => (
                                        <tr>
                                            <th><Link to={"/travel_time/" + item.TtID}>{item.TtID}</Link></th>
                                            <th>{username == "moder" && item.StatusTT == "сформирован" ? (<div>{item.StatusTT}<br />
                                                <button
                                                    onClick={() => handleApproveTT(item.TtID)}
                                                    className='redBTN microTTsBTN'
                                                >завершить</button>
                                                <button
                                                    onClick={() => handleDeclineTT(item.TtID)}
                                                    className='redBTN microTTsBTN'
                                                >отклонить</button>
                                            </div>) : item.StatusTT}</th>
                                            <th>{item.formattedDateCreateTT}</th>
                                            <th>{item.formattedDateUpdateTT}</th>
                                            <th>{item.formattedDateFinishTT}</th>
                                            <th>{item.DistanceTT}</th>
                                            <th>{(item.StatusTT == "завершен") ? item.ResultMinTT : "-"}</th>
                                            <th>{(item.StatusTT == "завершен") ? item.ResultMaxTT : "-"}</th>
                                            <th>{(item.StatusTT == "завершен") ? item.ResultChronical : "-"}</th>
                                        </tr>
                                    ))) : (<></>)}
                                </tbody>
                            </table>
                            // <table className="table">
                            //     <thead>
                            //         <tr>
                            //             <th>#</th>
                            //             <th>Статус</th>
                            //             <th>Тип местности</th>
                            //             <th>Дистанция</th>
                            //             <th>Создатель</th>
                            //             <th>Дата создания</th>
                            //             <th>Дата обновления</th>
                            //             <th>Дата завершения</th>
                            //             <th>Действия</th>
                            //         </tr>
                            //     </thead>
                            //     <tbody>
                            //         {travelTimes.map((item) => (
                            //             <tr key={item.TtID}>
                            //                 <td>
                            //                     <Link to={`/travel-time/${item.TtID}`} className="text-decoration-none">
                            //                         {item.TtID}
                            //                     </Link>
                            //                 </td>
                            //                 <td>
                            //                     <span
                            //                         className="badge"
                            //                         style={{
                            //                             backgroundColor: getStatusColor(item.StatusTT || ''),
                            //                             color: 'white'
                            //                         }}
                            //                     >
                            //                         {item.StatusTT}
                            //                     </span>
                            //                 </td>
                            //                 <td>{item.ChosenBiomTT}</td>
                            //                 <td>{item.DistanceTT} км</td>
                            //                 <td>{item.CreatorTT?.login || `ID: ${item.CreatorID_TT}`}</td>
                            //                 <td>{new Date(item.DateCreateTT || '').toLocaleDateString()}</td>
                            //                 <td>{item.DateUpdateTT ? new Date(item.DateUpdateTT).toLocaleDateString() : '—'}</td>
                            //                 <td>{item.DateFinishTT ? new Date(item.DateFinishTT).toLocaleDateString() : '—'}</td>
                            //                 <td>
                            //                     <div className="btn-group" role="group">
                            //                         <Link
                            //                             to={`/travel-time/${item.TtID}`}
                            //                             className="btn btn-sm btn-primary"
                            //                         >
                            //                             Просмотр
                            //                         </Link>
                            //                         {item.StatusTT === 'черновик' && (
                            //                             <button
                            //                                 className="btn btn-sm btn-danger"
                            //                                 onClick={(e) => handleDeleteTravelTime(item.TtID!, e)}
                            //                             >
                            //                                 Удалить
                            //                             </button>
                            //                         )}
                            //                     </div>
                            //                 </td>
                            //             </tr>
                            //         ))}
                            //     </tbody>
                            // </table>

                        )}
                    </div>
                )}
            </div>
        </Layout >
    )
}

export default TravelTimesPage