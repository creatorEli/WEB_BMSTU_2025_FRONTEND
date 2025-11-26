import { type FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/layout'
import { type Army } from "../../modules/Army"
import { mockArmies } from '../../modules/armiesMock'

const ArmyPage: FC = () => {
    const headerButtons = (
        <>
            <Link to="/" className="homeBTN redBTN">Главная</Link>
            <Link to="/armies" className="homeBTN redBTN">Все армии</Link>
            {/* <Link to="https://www.google.com" className="homeBTN redBTN">Google</Link> */}
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
                // Запрос к API для получения данных об одной армии
                const response = await fetch(`/api/army/${id}`)
                const data = await response.json()
                setArmy(data)
            } catch (error) {
                console.error('Ошибка загрузки армии:', error)
                let res = mockArmies.armies.find(army => army.ArmyID == Number(id))
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