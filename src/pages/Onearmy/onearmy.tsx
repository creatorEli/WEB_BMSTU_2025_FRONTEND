import { type FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Spinner, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/layout'
//import { type Army } from "../../modules/Army"
import { type DsArmy as Army } from '../../api/Api'
import { mockArmies } from '../../modules/armiesMock'
import { api } from '../../api'
import { useSelector } from 'react-redux'
import { type RootState } from '../../store'
import { useAppDispatch } from '../../hooks/redux'
import { logoutUserAsync } from '../../store/historianSlice'


const ArmyPage: FC = () => {
    const { username, isAuthenticated } = useSelector((state: RootState) => state.historian);
    const dispatch = useAppDispatch()
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
                <>
                    <Link to="/auth" className="homeBTN redBTN">Вход</Link>
                    <Link to="/reg" className="homeBTN redBTN">Регистрация</Link>
                </>
            )}
        </>
    )
    const { id } = useParams<{ id: string }>() // Получаем ID из URL
    const [army, setArmy] = useState<Army>()
    const [loading, setLoading] = useState(true)

    const [imageError, setImageError] = useState(false) // Состояние для ошибки изображения
    const defaultImage = "./../src/resources/images/default_army.jpg"

    useEffect(() => {
        const fetchArmy = async () => {
            try {
                setLoading(true)
                let ReqID = Number(id)
                // Запрос к API для получения данных об одной армии
                const resp = await api.army.armyDetail(ReqID);
                console.log(resp.data)
                // const response = await fetch(`/api/army/${id}`)
                // const data = await response.json()
                setArmy(resp.data)
                return
            } catch (error) {
                console.error('Ошибка загрузки армии:', error)
                console.error('Загружаю Mock!')
                let mores = (army: { ArmyID: number }) => army.ArmyID == Number(id)
                let res = mockArmies.armies.find(mores)
                console.log(res);
                setArmy(res)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchArmy()
        }
    }, [id])

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p>Загрузка данных об армии...</p>
            </Container>
        )
    }

    if (!army) {
        return (
            // <Container className="text-center mt-5">
            //     <h2>Армия не найдена</h2>
            // </Container>
            <Layout headerButtons={headerButtons}>
                <div className="wrapper">
                    <h1>Армия не найдена!</h1>
                </div>
            </Layout>
        )
    }

    const handleImageError = () => {
        setImageError(true)
    }

    return (
        <Layout headerButtons={headerButtons}>
            < div className="wrapper" >
                <h1>{army.NameArmy}</h1>

                <div className="oneArmySingle">
                    <div className="oasImage">
                        <img
                            src={(imageError || army.ImageArmyUrl == "") ? defaultImage : army.ImageArmyUrl}
                            alt={army.NameArmy}
                            onError={handleImageError}
                        />
                    </div>
                    <div className="oasInfo">
                        <div className="oasDescription">
                            <h3>Скорость передвижения в сутки:</h3>
                            <p>Равнина: {army.MinPlainSpeed} - {army.MaxPlainSpeed} км</p>
                            <p>Горы/холмы: {army.MinMountSpeed} - {army.MaxMountSpeed} км</p>
                            <p>Лес: {army.MinForestSpeed} - {army.MaxForestSpeed} км</p>
                            <p>Река: {army.MinRiverSpeed} - {army.MaxRiverSpeed} км</p>
                            <p>Пустыня: {army.MinDesertSpeed} - {army.MaxDesertSpeed} км</p>
                        </div>
                    </div>
                </div>

            </div >
        </Layout>
    )
}

export default ArmyPage