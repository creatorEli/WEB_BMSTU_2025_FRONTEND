import { type FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { type RootState } from '../../store'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/layout'
import { useAppDispatch } from '../../hooks/redux'
import { api } from '../../api';
import { logoutUserAsync } from '../../store/historianSlice';
import type { DsTravelTime } from '../../api/Api';
import { fetchTravelTimes, deleteTravelTime, clearError } from '../../store/travelTimeSlice';


const TravelTimesPage: FC = () => {

    const [tts, setTTs] = useState<DsTravelTime[]>([])
    const { username, isAuthenticated, historian } = useSelector((state: RootState) => state.historian);
    //const { armies, searchName, classFilter, loading, countTT } = useSelector((state: RootState) => state.armies)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { travelTimes, loading, error } = useSelector((state: RootState) => state.travelTime);

    const [filters, setFilters] = useState({
        statusTT: '',
        dateFromTT: '',
        dateToTT: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchTravelTimes(filters));
        } else {
            console.log("NOT Authenticated (travel time)")
            navigate('/auth');
        }
    }, [isAuthenticated, dispatch, navigate, filters]);


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
                <h1>Расчёты</h1>
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
                                <option value="черновик">черновик</option>
                                <option value="удален">удален</option>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {(travelTimes.travel_times) ? (travelTimes.travel_times.map((item) => (
                                        <tr>
                                            <th>{item.TtID}</th>
                                            <th>{item.StatusTT}</th>
                                            <th>{item.DateCreateTT}</th>
                                            <th>{item.DateUpdateTT}</th>
                                            <th>{item.DateFinishTT}</th>
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