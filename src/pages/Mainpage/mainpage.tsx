import { type FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/layout'
import { useSelector } from 'react-redux';
import { type RootState } from '../../store'
import { logoutUserAsync } from '../../store/historianSlice';
import { useAppDispatch } from '../../hooks/redux'

const MainPage: FC = () => {

    const { username, isAuthenticated } = useSelector((state: RootState) => state.historian);
    const dispatch = useAppDispatch();
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
            <Link to="/armies" className="homeBTN redBTN">Все армии</Link>

            {isAuthenticated ? (
                <>
                    <Link to="/travel_times" className="homeBTN redBTN">Все расчёты</Link>
                    <Link to="/historian_lks" className="homeBTN redBTN profileBTN">Профиль ({username})</Link>
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
            )
            }
        </>
    )

    return (
        <Layout headerButtons={headerButtons}>
            <div className="mpWrapper">
                <h1>Времена и Армии</h1>
                <p>Цель проекта - помочь историкам и реконструкторам
                    в изучении военной истории и особенностей различных армий мира</p>
            </div>
        </Layout>
    )
}

export default MainPage