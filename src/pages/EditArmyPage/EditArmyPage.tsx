import { type FC, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Spinner, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout/layout'
import { type DsArmy as Army } from '../../api/Api'
import { api } from '../../api'
import { useSelector } from 'react-redux'
import { type RootState } from '../../store'
import { useAppDispatch } from '../../hooks/redux'
import { logoutUserAsync } from '../../store/historianSlice'


const EditArmyPage: FC = () => {
    const { username, isAuthenticated, historian } = useSelector((state: RootState) => state.historian);

    const { id } = useParams<{ id: string }>()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [army, setArmy] = useState<Army | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [imageSaving, setImageSaving] = useState(false)

    const [aname, setAname] = useState('')
    //const [aimage, setAimage] = useState('')
    const [adesc, setAdesc] = useState('')
    const [aPlainMin, setAPlainMin] = useState('')
    const [aMountMin, setAMountMin] = useState('')
    const [aForestMin, setAForestMin] = useState('')
    const [aRiverMin, setARiverMin] = useState('')
    const [aDesertMin, setADesertMin] = useState('')
    const [aPlainMax, setAPlainMax] = useState('')
    const [aMountMax, setAMountMax] = useState('')
    const [aForestMax, setAForestMax] = useState('')
    const [aRiverMax, setARiverMax] = useState('')
    const [aDesertMax, setADesertMax] = useState('')

    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [imageError, setImageError] = useState(false) // Состояние для ошибки изображения
    const defaultImage = "./../src/resources/images/default_army.jpg"

    const isEditMode = !!id // Если есть id - режим редактирования, иначе - создания

    // Проверка авторизации и загрузка данных армии
    useEffect(() => {
        if (!isAuthenticated || historian?.Role != 1) {
            navigate('/forbidden')
            return
        }

        if (isEditMode) {
            fetchArmy()
        } else {
            // В режиме создания инициализируем пустые значения
            initializeFormForCreate()
            setLoading(false)
        }
    }, [id, isAuthenticated, historian])



    // Инициализация формы для создания новой армии
    const initializeFormForCreate = () => {
        setArmy(null)
        setAname('')
        setAdesc('')
        setAPlainMin('')
        setAPlainMax('')
        setAMountMin('')
        setAMountMax('')
        setAForestMin('')
        setAForestMax('')
        setARiverMin('')
        setARiverMax('')
        setADesertMin('')
        setADesertMax('')
        setSelectedImage(null)
        setImagePreview(null)
        setImageError(false)
    }

    // Загрузка армии с сервера (только для редактирования)
    const fetchArmy = async () => {
        try {
            setLoading(true)
            let ReqID = Number(id)
            const resp = await api.army.armyDetail(ReqID);
            const armyData = resp.data

            setArmy(armyData)
            // Загрузка армии с сервера (только для редактирования)
            if (armyData) {
                setAname(armyData.NameArmy || '')
                setAdesc(armyData.DescriptionArmy || '')
                setAPlainMin(armyData.MinPlainSpeed?.toString() || '')
                setAPlainMax(armyData.MaxPlainSpeed?.toString() || '')
                setAMountMin(armyData.MinMountSpeed?.toString() || '')
                setAMountMax(armyData.MaxMountSpeed?.toString() || '')
                setAForestMin(armyData.MinForestSpeed?.toString() || '')
                setAForestMax(armyData.MaxForestSpeed?.toString() || '')
                setARiverMin(armyData.MinRiverSpeed?.toString() || '')
                setARiverMax(armyData.MaxRiverSpeed?.toString() || '')
                setADesertMin(armyData.MinDesertSpeed?.toString() || '')
                setADesertMax(armyData.MaxDesertSpeed?.toString() || '')

                if (armyData.ImageArmyUrl) {
                    setImagePreview(armyData.ImageArmyUrl)
                }
            }

        } catch (error) {
            console.error('Ошибка загрузки армии:', error)
            navigate("/404")
        } finally {
            setLoading(false)
        }
    }

    // Обработка выбора изображения
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            // Создание превью для отображения
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Сохранение изображения
    const handleSaveImage = async () => {
        if (!selectedImage) {
            alert('Выберите изображение для загрузки')
            return
        }

        // В режиме создания сначала нужно сохранить армию
        if (!isEditMode && !army?.ArmyID) {
            alert('Сначала сохраните армию, чтобы загрузить изображение')
            return
        }

        try {
            setImageSaving(true)


            if (!army?.ArmyID) {
                throw new Error('ID армии не найден')
            }

            // Отправка изображения на сервер
            const response = await api.army.uploadImageCreate(String(army!.ArmyID), {
                ArmyID: army!.ArmyID || 0,
                image_army: selectedImage
            })

            alert('Изображение успешно сохранено!')
            setSelectedImage(null)

            // Сбрасываем input файла
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }

            // Обновляем данные армии после сохранения
            await fetchArmy()


        } catch (error) {

            console.error('Ошибка сохранения изображения:', error)
            alert('Ошибка при сохранении изображения')

        } finally {
            setImageSaving(false)
        }
    }




    // Сохранение изменений или создание новой армии

    const handleSaveArmy = async () => {
        // Валидация обязательных полей

        if (!aname.trim()) {
            alert('Введите название армии')
            return
        }

        try {
            setSaving(true)

            // Создаем объект с обновленными данными
            const updatedArmy: Partial<Army> = {
                //ArmyID: army!.ArmyID || -1,
                NameArmy: aname || army.NameArmy,
                DescriptionArmy: adesc || army.DescriptionArmy,
                MinPlainSpeed: Number(aPlainMin) || army.MinPlainSpeed || 0,
                MaxPlainSpeed: Number(aPlainMax) || army.MaxPlainSpeed || 0,
                MinMountSpeed: Number(aMountMin) || army.MinMountSpeed || 0,
                MaxMountSpeed: Number(aMountMax) || army.MaxMountSpeed || 0,
                MinForestSpeed: Number(aForestMin) || army.MinForestSpeed || 0,
                MaxForestSpeed: Number(aForestMax) || army.MaxForestSpeed || 0,
                MinRiverSpeed: Number(aRiverMin) || army.MinRiverSpeed || 0,
                MaxRiverSpeed: Number(aRiverMax) || army.MaxRiverSpeed || 0,
                MinDesertSpeed: Number(aDesertMin) || army.MinDesertSpeed || 0,
                MaxDesertSpeed: Number(aDesertMax) || army.MaxDesertSpeed || 0,
                StatusArmy: 'действует',
                ClassArmy: "step"
            }

            let savedArmy: Army;



            if (isEditMode) {
                // Режим редактирования: обновляем существующую армию
                if (!army?.ArmyID) {
                    throw new Error('ID армии не найден')
                }

                const response = await api.army.armyUpdate(army.ArmyID, updatedArmy)

                // Обновляем локальное состояние
                setArmy(prev => prev ? { ...prev, ...updatedArmy } : null)

                alert('Изменения успешно сохранены!')

            } else {
                // Режим создания: создаем новую армию

                const response = await api.army.armyCreate(updatedArmy)

                console.log(response.data)

                // Устанавливаем созданную армию в состояние
                setArmy(updatedArmy)

                alert('Армия успешно создана!')

                // Перенаправляем на страницу редактирования созданной армии
                navigate(`/moderate_armies`)
                return // Прерываем выполнение, так как произойдет переход
            }

            // Отправляем обновленные данные на сервер
            // Предполагается, что есть метод updateArmy
            // const response = await api.army.armyUpdate(army.ArmyID, updatedArmy)

            // // Обновляем локальное состояние
            // setArmy(prev => prev ? { ...prev, ...updatedArmy } : null)

            // alert('Изменения успешно сохранены!')
        } catch (error) {
            console.error('Ошибка сохранения армии:', error)
            alert('Ошибка при сохранении изменений')
        } finally {
            setSaving(false)
        }
    }

    // Сброс формы
    const handleResetForm = () => {
        if (isEditMode) {
            // В режиме редактирования сбрасываем к исходным данным
            if (army) {
                setAname(army.NameArmy || '')
                setAdesc(army.DescriptionArmy || '')
                setAPlainMin(army.MinPlainSpeed?.toString() || '')
                setAPlainMax(army.MaxPlainSpeed?.toString() || '')
                setAMountMin(army.MinMountSpeed?.toString() || '')
                setAMountMax(army.MaxMountSpeed?.toString() || '')
                setAForestMin(army.MinForestSpeed?.toString() || '')
                setAForestMax(army.MaxForestSpeed?.toString() || '')
                setARiverMin(army.MinRiverSpeed?.toString() || '')
                setARiverMax(army.MaxRiverSpeed?.toString() || '')
                setADesertMin(army.MinDesertSpeed?.toString() || '')
                setADesertMax(army.MaxDesertSpeed?.toString() || '')
                setImagePreview(army.ImageArmyUrl || null)
            }
        } else {
            // В режиме создания очищаем все поля
            initializeFormForCreate()
        }

        setSelectedImage(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }


    const handleLogout = async () => {
        console.log("handleLogout")
        try {
            await dispatch(logoutUserAsync()).unwrap();
            console.log("Выход успешен, перенаправляем на главную...");
            navigate('/');
        } catch (error) {
            console.error("Ошибка при выходе:", error);
            // Все равно перенаправляем, очищаем локально
            navigate('/');
        }
    };

    const headerButtons = (
        <>
            <Link to="/" className="homeBTN redBTN">Главная</Link>
            <Link to="/armies" className="homeBTN redBTN">Все армии</Link>
            {isAuthenticated ? (
                <>
                    <Link to="/historian_lks" className="homeBTN redBTN">Профиль ({username})</Link>
                    <button
                        className='redBTN homeBTN'
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                    >
                        Выход
                    </button>
                </>
            ) : (
                <>
                    <Link to="/auth" className="homeBTN redBTN">Вход</Link>
                    <Link to="/reg" className="homeBTN redBTN">Регистрация</Link>
                </>
            )}
        </>
    )

    const handleImageError = () => {
        setImageError(true)
    }


    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p>Загрузка данных об армии...</p>
            </Container>
        )
    }

    // if (!army) {
    //     navigate("/404")
    // }


    return (
        <Layout headerButtons={headerButtons}>
            <div className="wrapper" >
                <h1>{isEditMode ? 'Редактирование армии' : 'Создание новой армии'}</h1>
                <form className='EditArmyForm'>
                    <h2>Название Армии</h2>
                    <input
                        type="text"
                        className='EditNameArmy'
                        name="NameArmy"
                        value={aname}
                        placeholder='Введите название'
                        required
                        onChange={(e) => setAname(e.target.value)}
                    />



                    <h3>Изменить изображение армии</h3>

                    <div className="EditArmyImage">
                        {isEditMode && army?.ImageArmyUrl && (
                            <div>
                                <p>Текущее изображение</p>
                                <img
                                    src={imageError ? defaultImage : (army.ImageArmyUrl)}
                                    alt="Текущее изображение армии"
                                    onError={handleImageError}
                                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                                />
                            </div>
                        )}

                        <div>
                            <p>{isEditMode ? 'Новое изображение' : 'Изображение армии'}</p>
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Превью изображения"
                                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                                />
                            )}


                            <input
                                type="file"
                                ref={fileInputRef}
                                className='EditImageArmy'
                                name="ImageArmy"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>


                    <button
                        type="button"
                        className='redBTN saveImageBTN'
                        onClick={handleSaveImage}
                        disabled={!selectedImage || imageSaving}
                    >
                        {imageSaving ? 'Сохранение...' : 'Сохранить Изображение'}
                    </button>
                    <br />

                    <h2>Описание армии</h2>
                    <textarea
                        className='EditNameArmy'
                        name="NameArmy"
                        value={adesc}
                        placeholder='Введите описание'
                        onChange={(e) => setAdesc(e.target.value)}
                        rows={4}
                    />
                    <h2>Скорости на разных типах местности</h2>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Минимальная</th>
                                <th>Максимальная</th>
                            </tr>
                        </thead>
                        {/* <tbody>
                            <tr>
                                <th>
                                    Равнина
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        name='plainMin'
                                        className="chronoSpeedArmy"
                                        value={army?.MinPlainSpeed}
                                        onChange={(e) => setAPlainMin(e.target.value)}
                                        required
                                    />
                                    км/день
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        name='plainMax'
                                        className="chronoSpeedArmy"
                                        value={army?.MaxPlainSpeed}
                                        onChange={(e) => setAPlainMax(e.target.value)}
                                        required
                                    />
                                    км/день
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    Горы
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        name='mountMin'
                                        className="chronoSpeedArmy"
                                        value={army?.MinMountSpeed}
                                        onChange={(e) => setAMountMin(e.target.value)}
                                        required
                                    />
                                    км/день
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        name='mountMax'
                                        className="chronoSpeedArmy"
                                        value={army?.MaxMountSpeed}
                                        onChange={(e) => setAMountMax(e.target.value)}
                                        required
                                    />
                                    км/день
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    Лес
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        name='forestMin'
                                        className="chronoSpeedArmy"
                                        value={army?.MinForestSpeed}
                                        onChange={(e) => setAForestMin(e.target.value)}
                                        required
                                    />
                                    км/день
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        name='forestMax'
                                        className="chronoSpeedArmy"
                                        value={army?.MaxForestSpeed}
                                        onChange={(e) => setAForestMax(e.target.value)}
                                        required
                                    />
                                    км/день
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    Река
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        name='riverMin'
                                        className="chronoSpeedArmy"
                                        value={army?.MinRiverSpeed}
                                        onChange={(e) => setARiverMin(e.target.value)}
                                        required
                                    />
                                    км/день
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        name='riverMax'
                                        className="chronoSpeedArmy"
                                        value={army?.MaxRiverSpeed}
                                        onChange={(e) => setARiverMax(e.target.value)}
                                        required
                                    />
                                    км/день
                                </th>
                            </tr>
                            <tr>
                                <th>
                                    Пустыня
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        name='desertMin'
                                        className="chronoSpeedArmy"
                                        value={army?.MinDesertSpeed}
                                        onChange={(e) => setADesertMin(e.target.value)}
                                        required
                                    />
                                    км/день
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        name='desertMax'
                                        className="chronoSpeedArmy"
                                        value={army?.MaxDesertSpeed}
                                        onChange={(e) => setADesertMax(e.target.value)}
                                        required
                                    />
                                    км/день
                                </th>
                            </tr>
                        </tbody> */}

                        <tbody>
                            {['Равнина', 'Горы', 'Лес', 'Река', 'Пустыня'].map((terrain, index) => {
                                const minStates = [aPlainMin, aMountMin, aForestMin, aRiverMin, aDesertMin]
                                const maxStates = [aPlainMax, aMountMax, aForestMax, aRiverMax, aDesertMax]
                                const minSetters = [setAPlainMin, setAMountMin, setAForestMin, setARiverMin, setADesertMin]
                                const maxSetters = [setAPlainMax, setAMountMax, setAForestMax, setARiverMax, setADesertMax]

                                return (
                                    <tr key={terrain}>
                                        <th>{terrain}</th>
                                        <th>
                                            <input
                                                type="number"
                                                name={`${terrain.toLowerCase()}Min`}
                                                className="chronoSpeedArmy"
                                                value={minStates[index]}
                                                onChange={(e) => minSetters[index](e.target.value)}
                                                required
                                            />
                                            км/день
                                        </th>
                                        <th>
                                            <input
                                                type="number"
                                                name={`${terrain.toLowerCase()}Max`}
                                                className="chronoSpeedArmy"
                                                value={maxStates[index]}
                                                onChange={(e) => maxSetters[index](e.target.value)}
                                                required
                                            />
                                            км/день
                                        </th>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div style={{ marginTop: '20px' }}>
                        <button
                            type="button"
                            className='redBTN saveArmyBTN'
                            onClick={handleSaveArmy}
                            disabled={saving}
                            style={{ padding: '10px 30px', fontSize: '18px' }}
                        >
                            {saving ? 'Сохранение...' : 'Сохранить изменения армии'}
                        </button>
                    </div>
                </form>
            </div >
        </Layout>
    )
}

export default EditArmyPage