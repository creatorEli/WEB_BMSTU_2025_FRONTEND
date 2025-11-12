import './index.css'
import "./resources/styles/style.css"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import StartPage from './names'
import ArmiesPage from './pages/Armies/armies'
import 'bootstrap/dist/css/bootstrap.min.css';
import ArmyPage from './pages/Onearmy/onearmy'
import MainPage from './pages/Mainpage/mainpage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />
  },
  {
    path: '/armies',
    element: <ArmiesPage />
  },
  {
    path: '/army/:id',
    element: <ArmyPage />
  }
])
console.log("worked")
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <ul>
      <li>
        <a href="/">Главная страница</a>
      </li>
      <li>
        <a href="/new">Хочу на страницу с чем-то новеньким</a>
      </li>
      <li>
        <a href="/names">Страница с именами</a>
      </li>
      <li>
        <a href="/armies">Список армий</a>
      </li>
    </ul>
    <hr /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)
console.log("not worked")
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
