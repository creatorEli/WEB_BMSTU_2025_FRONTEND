import { type Army } from "../../modules/Army"
import { type FC, useState, } from "react"
import { Card, Col } from 'react-bootstrap'


interface ArmyCardProps {
    item: Army
}

const ArmyCard: FC<ArmyCardProps> = ({ item }) => {
    const [imageError, setImageError] = useState(false)
    const defaultImage = "http://localhost:3000/src/resources/images/default_army.jpg"

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
                <div className="oacButtons">
                    <a className='redBTN oacBTN' href={`/army/${item.ArmyID}`}>Подробнее</a>
                </div>
            </Card>
        </Col>
    )
}

export default ArmyCard