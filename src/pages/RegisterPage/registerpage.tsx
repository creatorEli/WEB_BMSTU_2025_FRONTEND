import { type FC, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import Layout from '../../components/Layout/layout'
import { api } from '../../api'

const RegisterPage: FC = () => {

    const navigate = useNavigate()
    const [hlogin, sethLogin] = useState('')
    const [hpassword, sethPassword] = useState('')
    const headerButtons = (
        <>
            <Link to="/" className="homeBTN redBTN">Главная</Link>
            <Link to="/armies" className="homeBTN redBTN">Все армии</Link>
            {/* <Link to="https://www.google.com" className="homeBTN redBTN">Google</Link> */}
            <Link to="/auth" className="homeBTN redBTN">Вход</Link>
        </>
    )
    const handleRegister = async () => {
        const res = await api.historian.postHistorian({
            loginHistorian: hlogin,
            passwordHistorian: hpassword
        })
        if (res.status == 202) {
            navigate('/auth');
        }
    }


    return (
        <Layout headerButtons={headerButtons}>
            <link rel="stylesheet" href="./login.css" />
            <div className="wrapper" >
                <h1>Регистрация</h1>
                <div className="registerForm">
                    <form className="register" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                        <label>Логин</label>
                        <input type="text" name="historianLogin" className="loginField" id="historianLogin" onChange={(e) => sethLogin(e.target.value)} />
                        <label>Пароль</label>
                        <input type="password" name="historianPassword" className="loginField" id="historianPassword" onChange={(e) => sethPassword(e.target.value)} />
                        <Button className="redBTN loginBTN" onClick={handleRegister}>
                            Зарегистрироваться
                        </Button>
                    </form>
                </div >
            </div>
        </Layout >
    )
}

export default RegisterPage