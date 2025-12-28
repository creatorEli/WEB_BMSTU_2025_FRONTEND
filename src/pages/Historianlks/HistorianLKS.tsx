import { type FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { type RootState } from '../../store'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import Layout from '../../components/Layout/layout'
import { logoutUserAsync, updateHistorianAsync } from '../../store/historianSlice'
import { useAppDispatch } from '../../hooks/redux'
import { api } from '../../api';


const HistorianLKS: FC = () => {
    const { isAuthenticated, historian } = useSelector((state: RootState) => state.historian);

    const headerButtons = (
        <>
            <Link to="/" className="homeBTN redBTN">Главная</Link>
            <Link to="/armies" className="homeBTN redBTN">Все армии</Link>

        </>
    )
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [hlogin, sethLogin] = useState('')
    const [hpassword, sethPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [openedForm, setOpenedForm] = useState<boolean>(false);

    const handleChangeHisData = async () => {
        console.log("handleChangeHisData");
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const result = await dispatch(updateHistorianAsync({
                username: hlogin,
                password: hpassword
            })).unwrap();

            console.log("Обновлённый историк: ", result);
            setSuccessMessage('Данные успешно обновлены!');
            // navigate('/');

            // Закрываем форму и очищаем поля
            setOpenedForm(false);
            sethLogin('');
            sethPassword('');

        } catch (error: any) {
            console.log("Ошибка сохранения данных: ", error);
            setErrorMessage(error || 'Произошла ошибка при сохранении данных!');
        } finally {
            setIsLoading(false);
        }
    };

    //  Загружаем данные историка при загрузке компонента
    useEffect(() => {
        const getHistorianInfo = async () => {
            console.log("getHistorianInfo, загружаем инфу об историке...")

            try {
                const response = await api.historian.historianList();
                console.log("Информация об историке: ", response.data);

                // Если бэкенд возвращает историка, можно обновить состояние
                if (response.data.historian) {
                    // Здесь можно диспатчить действие для обновления состояния
                    // Например, если у вас есть синхронное действие для установки историка
                }

            } catch (error: any) {
                console.error("Ошибка инфы об историке: ", error);
                if (error.response?.status === 401) {
                    dispatch(logoutUserAsync());
                    navigate('/forbidden');
                }
            }
        }
        if (isAuthenticated) {
            getHistorianInfo()
        } else {
            console.log("NOT Authenticated")
            navigate('/forbidden');
        }
    }, [isAuthenticated, dispatch]);
    console.log("historian Role : ", historian?.Role)
    return (
        <Layout headerButtons={headerButtons}>
            <div className="wrapper hislksWrap">
                <h1>Ваш личный кабинет</h1>
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )}

                <h2>Ваши данные:</h2>
                <p>Ваш логин: {historian?.login}</p>
                <p>{(historian?.Role) ? (
                    <>
                        Вы являетесь модератором <br />
                        <Link to='/moderate_armies' className='moderateArmiesBTN redBTN'>Управление армиями</Link>
                    </>
                ) : (
                    <>Вы не модератор!</>
                )}</p>

                <button className="redBTN changeUserDataBTN" onClick={() => {
                    setOpenedForm(!openedForm);
                    setErrorMessage('');
                    setSuccessMessage('');
                }}>{openedForm ? 'Скрыть форму' : 'Изменить ваши данные'}</button>

                {openedForm && (<div className="changeDataForm registerForm">
                    <form className="register" onSubmit={(e) => { e.preventDefault(); handleChangeHisData(); }}>
                        <label>Новый логин</label>
                        <input
                            type="text"
                            name="historianLogin"
                            className="loginField"
                            id="historianLogin"
                            value={historian?.login}
                            onChange={(e) => sethLogin(e.target.value)}
                            disabled={isLoading}
                            placeholder={historian?.login || 'Введите новый логин'}
                        />
                        <label>Новый пароль</label>
                        <input
                            type="password"
                            name="historianPassword"
                            className="loginField"
                            id="historianPassword"
                            value={hpassword}
                            onChange={(e) => sethPassword(e.target.value)}
                            disabled={isLoading}
                            placeholder="Введите новый или текущий пароль"
                        />
                        <Button
                            type='submit'
                            className="redBTN loginBTN"
                            disabled={isLoading || !hlogin || !hpassword}
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                        </Button>
                    </form>
                </div>)}

                <div style={{ marginTop: '30px' }} className='extraLKS'>
                    <h2>Дополнительные действия:</h2>
                    <button
                        className="redBTN changeUserDataBTN"
                        onClick={() => {
                            dispatch(logoutUserAsync());
                            navigate('/');
                        }}
                    >
                        Выйти из системы
                    </button><br />
                    <Link to="/travel_times" className="redBTN changeUserDataBTN myTTs">
                        {(historian?.Role) ? "Расчёты" : "Мои расчёты"}
                    </Link>
                </div>
            </div>
        </Layout >
    )
}

export default HistorianLKS