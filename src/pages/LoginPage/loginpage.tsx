import { type FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import Layout from '../../components/Layout/layout'
import { loginUserAsync } from '../../store/historianSlice'
import { useAppDispatch } from '../../hooks/redux'

const LoginPage: FC = () => {
    const headerButtons = (
        <>
            <Link to="/" className="homeBTN redBTN">Главная</Link>
            <Link to="/armies" className="homeBTN redBTN">Все армии</Link>
            <Link to="/reg" className="homeBTN redBTN">Регистрация</Link>
            {/* <Link to="https://www.google.com" className="homeBTN redBTN">Google</Link> */}

        </>
    )
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [hlogin, sethLogin] = useState('')
    const [hpassword, sethPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleAuth = async (username: string, password: string) => {
        console.log("handleAuth");
        setIsLoading(true);
        setErrorMessage('');

        try {
            const result = await dispatch(loginUserAsync({ username, password })).unwrap();
            console.log("handleAuth: Успешный вход, результат:", result);
            console.log("handleAuth: Историк:", result.historian);
            console.log("handleAuth: Токен:", result.token);
            // Перенаправление после успешного входа
            navigate('/');
        } catch (error: any) {
            console.log("Ошибка входа:", error);
            setErrorMessage(error || 'Произошла ошибка при авторизации');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout headerButtons={headerButtons}>
            <link rel="stylesheet" href="./login.css" />
            <div className="wrapper" >
                <h1>Авторизация</h1>
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}
                <div className="registerForm">
                    <form className="register" onSubmit={(e) => { e.preventDefault(); handleAuth(hlogin, hpassword); }}>
                        <label>Логин</label>
                        <input
                            type="text"
                            name="historianLogin"
                            className="loginField"
                            id="historianLogin"
                            value={hlogin}
                            onChange={(e) => sethLogin(e.target.value)}
                            disabled={isLoading}
                        />
                        <label>Пароль</label>
                        <input
                            type="password"
                            name="historianPassword"
                            className="loginField"
                            id="historianPassword"
                            value={hpassword}
                            onChange={(e) => sethPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button
                            type='submit'
                            className="redBTN loginBTN"
                            disabled={isLoading || !hlogin || !hpassword}
                        >
                            {isLoading ? 'Вход...' : 'Войти'}
                        </Button>
                    </form>
                </div >
            </div>
        </Layout >
    )
}

export default LoginPage