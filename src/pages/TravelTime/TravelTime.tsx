import { type FC, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../../components/Layout/layout'
import { type RootState } from '../../store'
import { useAppDispatch } from '../../hooks/redux'
import { logoutUserAsync } from '../../store/historianSlice'
import { api } from '../../api';

import {
    fetchTravelTimeById,
    updateTravelTimeFields,
    deleteArmyFromTravelTime,
    updateArmyChronical,
    formTravelTime,
    deleteTravelTime,
    //moderateTravelTime,
    clearCurrentTravelTime,
    clearError
} from '../../store/travelTimeSlice';
//import { DsArmy } from '../../api/Api';

const TravelTimePage: FC = () => {
    const { ttid } = useParams<{ ttid: string }>() // Получаем ID из URL
    const { currentTravelTime, loading } = useSelector((state: RootState) => state.travelTime);
    const { isAuthenticated, username, historian } = useSelector((state: RootState) => state.historian);


    const dispatch = useAppDispatch()
    const navigate = useNavigate();


    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        chosenBiomTT: '',
        distanceTT: 0,
    });

    const [chronicalData, setChronicalData] = useState<Record<number, number>>({});


    useEffect(() => {
        if (ttid == "-1" || !isAuthenticated) {
            navigate("/armies")
        }
        if (ttid) {
            dispatch(fetchTravelTimeById(parseInt(ttid)));
        }
        return () => {
            dispatch(clearCurrentTravelTime());
        };
    }, [ttid, isAuthenticated, dispatch, navigate]);


    useEffect(() => {
        if (currentTravelTime) {
            setFormData({
                chosenBiomTT: currentTravelTime.time_travel!.chosenBiomTT || '',
                distanceTT: currentTravelTime.time_travel!.distanceTT || 0,
            });

            // Инициализируем данные для летописных сведений
            const initialChronical: Record<number, number> = {};
            if (currentTravelTime.list_armies) {
                currentTravelTime.list_armies.forEach(item => {
                    const armyId = item.Army.ArmyID;
                    // Используем значение из KmPerDayChronical, если оно есть, иначе оставляем пустым
                    initialChronical[armyId] = item.KmPerDayChronical || 0;
                });
            }
            setChronicalData(initialChronical);
        }
    }, [currentTravelTime]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'distanceTT' ? parseFloat(value) || 0 : value
        }));
    };

    const handleUpdateTravelTime = async () => {
        try {
            await dispatch(updateTravelTimeFields({
                ttid: parseInt(ttid!),
                data: formData
            })).unwrap();
            //setEditMode(false);
            alert('Данные успешно обновлены');
            handleFormTravelTime()
            //dispatch(fetchTravelTimeById(parseInt(ttid!)));
        } catch (error: any) {
            alert(`Ошибка: ${error}`);
        }
    };


    const handleDeleteArmy = async (armyId: number) => {
        if (window.confirm('Вы уверены, что хотите удалить эту армию из расчета?')) {
            try {
                await dispatch(deleteArmyFromTravelTime({
                    ttid: parseInt(ttid!),
                    armyId
                })).unwrap();
                console.log('Армия успешно удалена из расчета');
                dispatch(fetchTravelTimeById(parseInt(ttid!)));
            } catch (error: any) {
                console.error(`Ошибка: ${error}`);
            }
        }
    };


    // const handleUpdateChronical = async (armyId: number) => {
    //     const newKm = chronicalData[armyId];
    //     if (newKm === undefined || newKm <= 0) {
    //         alert('Введите корректное значение');
    //         return;
    //     }

    //     try {
    //         await dispatch(updateArmyChronical({
    //             ttid: parseInt(ttid!),
    //             armyId,
    //             newKmPerDayChronical: newKm
    //         })).unwrap();
    //         alert('Летописные сведения обновлены');
    //     } catch (error: any) {
    //         alert(`Ошибка: ${error}`);
    //     }
    // };

    const handleFormTravelTime = async () => {
        try {
            await dispatch(formTravelTime(parseInt(ttid!))).unwrap();
            alert('Расчет успешно сформирован');
        } catch (error: any) {
            alert(`Ошибка: ${error}`);
        }
    };

    const handleDeleteTravelTime = async () => {
        if (window.confirm('Вы уверены, что хотите удалить этот расчет?')) {
            try {
                await dispatch(deleteTravelTime(parseInt(ttid!))).unwrap();
                alert('Расчет успешно удален');
                navigate('/armies');
            } catch (error: any) {
                alert(`Ошибка: ${error}`);
            }
        }
    };

    // const handleModerate = async (action: 'завершить' | 'отклонить') => {
    //     if (window.confirm(`Вы уверены, что хотите ${action} этот расчет?`)) {
    //         try {
    //             await dispatch(moderateTravelTime({
    //                 ttid: parseInt(ttid!),
    //                 statusTT: action
    //             })).unwrap();
    //             alert(`Расчет успешно ${action === 'завершить' ? 'завершен' : 'отклонен'}`);
    //         } catch (error: any) {
    //             alert(`Ошибка: ${error}`);
    //         }
    //     }
    // };

    const isCreator = true
    const isModerator = historian?.role === 1;
    const canEdit = isCreator && currentTravelTime?.time_travel!.statusTT === 'черновик';

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
            <Link to="/travel_times" className="homeBTN redBTN">Все расчеты</Link>
            <Link to="/armies" className="homeBTN redBTN">Все армии</Link>
            <Link to="/historian_lks" className="homeBTN redBTN">Профиль ({username})</Link>
            <button
                className='redBTN homeBTN'
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
            >
                Выход
            </button>
        </>
    )

    if (loading) {
        return (
            <Layout headerButtons={headerButtons}>
                <div className="wrapper text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!currentTravelTime) {
        return (
            <Layout headerButtons={headerButtons}>
                <div className="wrapper">
                    <div className="alert alert-danger">Расчет не найден</div>
                    <Link to="/travel-times" className="btn btn-primary">
                        Вернуться к списку расчетов
                    </Link>
                </div>
            </Layout>
        );
    }


    const handleChronicalChange = (armyId: number, value: number) => {
        // Обновляем локальное состояние
        console.log("value = ", value)
        setChronicalData(prev => ({
            ...prev,
            [armyId]: value
        }));
        handleSaveChronicalData(armyId, value)
    };

    const handleSaveChronicalData = async (armyId: number, chronicalValue: number) => {
        //const chronicalValue = chronicalData[armyId];
        console.log("chronicalValue = ", chronicalValue)
        // Проверяем, что значение есть и оно число
        if (chronicalValue === undefined) {
            //alert('Введите значение летописной скорости');
            return;
        }

        const numericValue = typeof chronicalValue === 'string'
            ? parseInt(chronicalValue)
            : chronicalValue;

        if (isNaN(numericValue) || numericValue < 0) {
            alert('Введите корректное положительное число');
            return;
        }

        try {
            const res = await dispatch(updateArmyChronical({
                ttid: parseInt(ttid!),
                armyId,
                newKmPerDayChronical: numericValue
            })).unwrap();

            console.log("res = ", res)

            //alert('Летописные данные обновлены');
            // После успешного сохранения перезагружаем данные
            //dispatch(fetchTravelTimeById(parseInt(ttid!)));

        } catch (error: any) {
            alert(`Ошибка обновления летописных данных: ${error}`);
        }
    };


    const { time_travel, list_armies } = currentTravelTime;

    return (
        <Layout headerButtons={headerButtons}>
            <div className="wrapper" >
                <h1>Расчёт времени в пути (сутки)</h1>

                <div className="armiesToCalc">

                    {
                        list_armies!.map((item) => {
                            const army = item.Army;
                            return (
                                < div className="oneATC" >
                                    <div className="atcImage">
                                        <img src={army.ImageArmyUrl} alt=" image" />
                                    </div>
                                    <div className="atcDescription">
                                        <h3>{army.NameArmy}</h3>
                                        <p>Равнина: {army.MinPlainSpeed} - {army.MaxPlainSpeed} км</p>
                                        <p>Горы/холмы: {army.MinMountSpeed} - {army.MaxMountSpeed} км</p>
                                        <p>Лес: {army.MinForestSpeed} - {army.MaxForestSpeed} км</p>
                                        <p>Река: {army.MinRiverSpeed} - {army.MaxRiverSpeed} км</p>
                                        <p>Пустыня: {army.MinDesertSpeed} - {army.MaxDesertSpeed} км</p>
                                    </div>
                                    <div className="atcButtons">
                                        <div>
                                            <input
                                                type="text"
                                                name='chronoSpeedArmy'
                                                value={chronicalData[army.ArmyID] || ''}
                                                className="chronoSpeedArmy"
                                                onChange={(e) => handleChronicalChange(army.ArmyID, +(e.target.value))}
                                            />
                                            <p>летописная скорость<br />(км/день)</p>
                                        </div>

                                        <Link to={`/army/${army.ArmyID}`} className="redBTN atcBTN">Подробнее</Link>
                                        <button
                                            className="redBTN atcBTN"
                                            onClick={() => handleDeleteArmy(army.ArmyID!)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>

                            )
                        })
                    }
                </div>

                <div className="calculateFields">
                    <form>

                        <select
                            name="chosenBiomTT"
                            value={formData.chosenBiomTT}
                            onChange={handleInputChange}>
                            <option value="" disabled selected>Выберите тип местности</option>
                            <option value="Plain">Равнина</option>
                            <option value="Mount">Горы</option>
                            <option value="Forest">Лес</option>
                            <option value="River">Река</option>
                            <option value="Desert">Пустыня</option>
                        </select>
                        <input
                            type="number"
                            name="distanceTT"
                            value={formData.distanceTT}
                            onChange={handleInputChange}
                            min="0"
                            step="0.1"
                            placeholder="Пройденное расстояние"
                        />

                        <button className="redBTN calculateBTN" onClick={handleUpdateTravelTime}>Сформировать</button>
                        <button className="redBTN deleteBTN" onClick={handleDeleteTravelTime}>Удалить</button>
                    </form>
                </div>

                <div className="resultReq">
                    {time_travel!.resultMinTT && time_travel!.resultMaxTT && (

                        <>
                            <h2>Время перехода составляет:
                                <br />Минимальное - <span className="calcDays">{time_travel!.resultMinTT}</span> суток
                                <br /> Максимальное - <span className="calcDays">{time_travel!.resultMaxTT}</span> суток
                                {time_travel!.resultChronical && (
                                    <><br />По летописи - <span className="calcDays">{time_travel!.resultChronical}</span> дней </>
                                )}
                            </h2>
                        </>
                    )}
                </div>
            </div >
        </Layout >
    )
}

export default TravelTimePage