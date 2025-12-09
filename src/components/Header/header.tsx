// src/components/Header/Header.tsx
import { type FC, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {
    children?: ReactNode // Для дополнительных кнопок
}

const Header: FC<HeaderProps> = ({ children }) => {
    return (
        <div>
            <div className="header wrapper">
                <div className="logo">
                    <Link to="/">
                        <img src="./../src/resources/images/logo.png" alt="Логотип" />
                    </Link>
                </div>

                <div className="headerBTNs">
                    {/* <Link to="/" className="homeBTN redBTN">Домой</Link> */}
                    {children} {/* Динамические кнопки будут здесь */}
                </div>

                <div className="headerBTNSburger" onClick={(event) => event.currentTarget.classList.toggle('BurgerActive')}>
                    <div className="headBurgerTarget" />
                    <div className="headBurgerMobileMenu">
                        {children}
                    </div>
                </div>
            </div>
            <div className='animalRow'></div>
        </div>
    )
}

export default Header