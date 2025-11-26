// src/components/Layout/Layout.tsx
import { type FC, type ReactNode } from 'react'
import Header from '../Header/header'
import Breadcrumbs from '../Breadcrumbs/breadcrumbs'

interface LayoutProps {
    children?: ReactNode
    headerButtons?: ReactNode // Кнопки для хедера
}

const Layout: FC<LayoutProps> = ({ children, headerButtons }) => {
    return (
        <div>
            <Header>
                {headerButtons} {/* Передаем кнопки в Header */}
            </Header>
            <Breadcrumbs />
            <main>
                {children}
            </main>
        </div>
    )
}

export default Layout