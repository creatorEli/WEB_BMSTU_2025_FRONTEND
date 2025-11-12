import { type FC, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Button } from 'react-bootstrap'
import Layout from '../../components/Layout/layout'
import { mockArmies } from "../../modules/armiesMock"
import { type Army, type ArmyResult } from '../../modules/Army'
import ArmyCard from '../../components/ArmyCard/ArmyCard'


const getArmies = async (searchNameArmy = '', classNameArmy = ''): Promise<ArmyResult> => {
    let res = fetch(`/api/armies?searchNameArmy=${searchNameArmy}&class=${classNameArmy}`)
        .then((response) => {
            return response.json()
        })
        .catch((error) => {
            console.error('API request failed, using mock data:', error)
            // Возвращаем моки при любой ошибке
            return mockArmies
        })
    return res
}

const ArmiesPage: FC = () => {
    const headerButtons = (
        <>
            <Link to="/" className="homeBTN redBTN">Главная</Link>
        </>
    )

    const [searchNameArmyValue, setSearchNameArmyValue] = useState('')

    const [searchclassNameArmyValue, setSearchclassNameArmyValue] = useState('')

    const [loading, setLoading] = useState(false)

    const [army, setArmy] = useState<Army[]>([])
    const [countTT, setCountTT] = useState(0)

    const handleSearch = async () => {
        //await setLoading(true)
        setLoading(true)
        try {
            const { armies } = await getArmies(searchNameArmyValue, searchclassNameArmyValue)
            //console.log('Received armies:', armies);
            setArmy(armies)
        } catch (error) {
            console.error('Search error:', error)
            //setArmy([])
            setArmy(mockArmies.armies)
        } finally {
            setLoading(false)
        }
    }

    // Обработчик для фильтров
    const handleFilterClick = async (classNamer: string) => {
        //await setLoading(true)
        setLoading(true)
        //setSearchclassNameArmyValue(className)
        // Поиск произойдет после обновления состояния
        try {
            //console.log('Received class:', classNamer);
            const { armies } = await getArmies("", classNamer)
            console.log('Received armies:', armies);
            setArmy(armies)
        } catch (error) {
            console.error('Search error:', error)
            //setArmy([])
            setArmy(mockArmies.armies) // не работает фильтрация, при Mock
        } finally {
            setLoading(false)
        }
    }

    const handleTTClick = async () => {
        setCountTT(0)
        return countTT
    }

    useEffect(() => {
        handleSearch()
    }, [])

    return (
        <Layout headerButtons={headerButtons}>
            <a href="#" className="timesBTN redBTN" onClick={handleTTClick}>Расчёт <span className="homeBTNcount">{countTT}</span></a>
            <div className="wrapper">
                <h1>Виды войск и суточное расстояние</h1>

                <div className="searchArmies">
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                        <input type="text" name="searchNameArmy" className="searchNameArmy" placeholder="Введите род войск"
                            value={searchNameArmyValue} onChange={(e) => setSearchNameArmyValue(e.target.value)} />
                        <Button className="redBTN searchBTN" onClick={() => handleSearch()}>Поиск</Button>
                    </form>
                </div>
                <div className="filters">
                    <h2>ФИЛЬТРЫ:</h2>
                    <div className="filtersRow">
                        <form action="armies" method="get">
                            <button type="button" className="filterBTN" onClick={() => handleFilterClick("")}>
                                Все
                            </button>
                            <button type="button" className="filterBTN" onClick={() => handleFilterClick("step")} >
                                Пешие
                            </button>
                            <button type="button" className="filterBTN" onClick={() => handleFilterClick("horse")}>
                                Кавалерия
                            </button>
                            <button type="button" className="filterBTN" onClick={() => handleFilterClick("wheel")}>
                                Колёсные
                            </button>
                        </form>
                    </div>
                </div>
                <div className="armies">


                    <Row xs={3} md={3} lg={3} xl={3}>
                        {army.map((item, index) => (
                            <ArmyCard key={item.ArmyID} item={item} />
                        ))}
                    </Row>
                    {/* {{ range .armies }}
                    <div className="oneArmyCard">
                        <div className="oacImage">
                            <img src="{{ .ImageArmyUrl }}" alt="image">
                        </div>
                        <div className="oacDescription">
                            <h3>{{.NameArmy }}</h3>
                            <p>Равнина: {{ .MinPlainSpeed }} - {{ .MaxPlainSpeed }} км</p>
                            <p>Горы/холмы: {{ .MinMountSpeed }} - {{ .MaxMountSpeed }} км</p>
                            <p>Лес: {{.MinForestSpeed }} - {{.MaxForestSpeed }} км</p>
                            <p>Река: {{.MinRiverSpeed }} - {{.MaxRiverSpeed }} км</p>
                            <p>Пустыня: {{.MinDesertSpeed }} - {{.MaxDesertSpeed }} км</p>
                        </div>
                        <div className="oacButtons">
                            <a href="/one_army/{{ .ArmyID }}" className="redBTN oacBTN">Подробнее</a>
                            <form action="/add_army_to_tt/{{ .ArmyID }}" method="post">
                                <button className="redBTN oacBTN">Добавить</button>
                            </form>
                        </div>
                    </div> */}

                </div >
            </div >
        </Layout>
    )
}

export default ArmiesPage