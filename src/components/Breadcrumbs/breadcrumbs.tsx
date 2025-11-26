import { Link, useLocation } from 'react-router-dom';
import { mockArmies } from '../../modules/armiesMock';
import type { Army } from '../../modules/Army';
import { useState, useEffect } from 'react'

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    const [armyNames, setArmyNames] = useState<Record<number, string>>({})

    // Функция для получения названия армии
    const getArmyName = async (id: number): Promise<string> => {
        // Сначала проверяем кэш
        if (armyNames[id]) {
            return armyNames[id]
        }

        try {
            // Пробуем получить данные с сервера
            const response = await fetch(`/api/army/${id}`)
            if (response.ok) {
                const army: Army = await response.json()
                return army.NameArmy
            }
        } catch (error) {
            console.error('Ошибка загрузки армии:', error)
        }

        // Если сервер не ответил, ищем в моках
        const mockArmy = mockArmies.armies.find(a => a.ArmyID === id)
        return mockArmy ? mockArmy.NameArmy : `Армия ${id}`
    }

    useEffect(() => {

        const loadArmyNames = async () => {
            const newArmyNames: Record<number, string> = {}

            for (let i = 0; i < pathnames.length; i++) {
                const value = pathnames[i]
                // Проверяем, является ли этот сегмент ID армии
                const isArmyId = i > 0 && pathnames[i - 1] === 'army' && !isNaN(Number(value))

                if (isArmyId) {
                    const armyId = Number(value)
                    const name = await getArmyName(armyId)
                    newArmyNames[armyId] = name
                }
            }

            setArmyNames(prev => ({ ...prev, ...newArmyNames }))
        }

        loadArmyNames()
    }, [pathnames.join('/')]) // Зависимость от полного пути

    return (
        <div className="wrapper">
            <div className=' breadcrumber'>
                <Link to="/">Главная</Link>
                {pathnames.map((value, index) => {
                    let to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    // Заменяем "army" на "armies" в URL
                    to = to.replace(/\/army\b/g, '/armies');
                    let displayName = value;
                    const isArmyId = index > 0 && pathnames[index - 1] === 'army' && !isNaN(Number(value))


                    if (value === 'army') {
                        displayName = 'armies';

                    }
                    if (isArmyId) {
                        const armyId = Number(value)

                        displayName = armyNames[armyId]// || `Армия ${armyId}`
                        console.log(displayName);

                    }


                    const isLast = index === pathnames.length - 1;
                    return isLast ? (
                        <span key={to}> / {displayName}</span>
                    ) : (
                        <span key={to}> / <Link to={to}>{displayName}</Link></span>
                    );
                })}
            </div>
        </div>
    );
};

export default Breadcrumbs;