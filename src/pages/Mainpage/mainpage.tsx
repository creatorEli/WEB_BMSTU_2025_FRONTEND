import { type FC } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/layout'


const MainPage: FC = () => {
    const headerButtons = (
        <>
            <Link to="/armies" className="homeBTN redBTN">Все армии</Link>
        </>
    )

    return (
        <Layout headerButtons={headerButtons}>
            <div className="mpWrapper">
                <h1>Времена и Армии</h1>
                <p>Цель проекта - помочь историкам и реконструкторам
                    в изучении военной истории и особенностей различных армий мира</p>
                {/* <div className="mpfiller"> </div>*/}


            </div>
        </Layout>
    )
}

export default MainPage