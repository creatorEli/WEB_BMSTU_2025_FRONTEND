import { type DsArmy } from "../../api/Api"
import { type FC, useState, useEffect } from "react"
import { Card, Col } from 'react-bootstrap'
import { useSelector } from "react-redux"
import { Link, useNavigate } from 'react-router-dom'
import { type RootState } from '../../store'
import { api } from '../../api';


interface ArmyCardProps {
    item: DsArmy
    onAddSuccess?: () => void // Callback при успешном добавлении
}

const ArmyCard: FC<ArmyCardProps> = ({ item, onAddSuccess }) => {
    const [imageError, setImageError] = useState(false)
    const [addError, setAddError] = useState<string | null>(null)
    const [addSuccess, setAddSuccess] = useState(false)
    const defaultImage = "./../src/resources/images/default_army.jpg"
    const navigate = useNavigate();
    const { username, isAuthenticated, historian } = useSelector((state: RootState) => state.historian);

    // const handleAddToTTdraft = (army_id: number | undefined) => {
    //     console.log(army_id)
    // }

    const handleAddToTTdraft = async () => {
        if (!isAuthenticated) {
            alert('Для добавления в черновик необходимо авторизоваться')
            setTimeout(() => navigate('/auth'), 2000)
            return
        }

        try {
            const response = await api.army.addToTravelCreate({
                ArmyID: item.ArmyID!
            })
            if (response.status === 208) {
                setAddError(response.data?.message || "Армия уже присутствует в расчёте")
            } else {
                setAddSuccess(true)
            }
            // Вызываем callback если передан
            if (onAddSuccess) {
                onAddSuccess()
            }
            // Автоматически скрываем сообщение об успехе через 3 секунды
            setTimeout(() => {
                setAddSuccess(false)
                setAddError(null)
            }, 3000)
        }
        catch (error: any) {
            console.error('Ошибка добавления в расчёт:', error)
            if (error.response?.status === 401) {
                alert('Сессия истекла. Пожалуйста, войдите снова.')
                setTimeout(() => navigate('/auth'), 2000)
            } else if (error.response?.status === 400) {
                setAddError(error.response.data?.message || 'Ошибка при добавлении в расчёт')
            } else if (error.response?.status === 208) {
                setAddError(error.response.data?.message || 'Ошибка при добавлении в расчёт')
            } else {
                setAddError('Не удалось добавить армию в расчёт')
            }
        }
    }

    // Очищаем сообщение об ошибке через 5 секунд
    useEffect(() => {
        if (addError) {
            const timer = setTimeout(() => {
                setAddError(null)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [addError])

    return (
        <Col key={item.ArmyID}>
            <Card className='card oneArmyCard'>
                <div className="oacImage">
                    {/* <Card.Img className="cardImage" variant="top" src={item.ImageArmyUrl} alt="image" /> */}
                    <Card.Img
                        className="cardImage"
                        variant="top"
                        src={(imageError || item.ImageArmyUrl == "") ? defaultImage : item.ImageArmyUrl}
                        alt={item.NameArmy}
                        onError={() => setImageError(true)}
                    />
                </div>
                <div className="oacDescription">
                    <h3>{item.NameArmy}</h3>
                    <p>Равнина: {item.MinPlainSpeed} - {item.MaxPlainSpeed} км</p>
                    <p>Горы/холмы: {item.MinMountSpeed} - {item.MaxMountSpeed} км</p>
                    <p>Лес: {item.MinForestSpeed} - {item.MaxForestSpeed} км</p>
                    <p>Река: {item.MinRiverSpeed} - {item.MaxRiverSpeed} км</p>
                    <p>Пустыня: {item.MinDesertSpeed} - {item.MaxDesertSpeed} км</p>
                </div>

                {/* Сообщения об ошибках/успехе */}
                {addError && (
                    <div className="alert alert-danger mt-2 mb-2" style={{ margin: '0 10px' }}>
                        {addError}
                    </div>
                )}

                {addSuccess && (
                    <div className="alert alert-success mt-2 mb-2" style={{ margin: '0 10px' }}>
                        Армия успешно добавлена в черновик!
                    </div>
                )}
                <div className="oacButtons">
                    <Link className='redBTN oacBTN' to={`/army/${item.ArmyID}`}>Подробнее</Link>
                    {(isAuthenticated) && <button className='redBTN oacBTN' onClick={() => { handleAddToTTdraft(item.ArmyID) }}>Добавить</button>}
                </div>
            </Card>
        </Col>
    )
}

export default ArmyCard