import './index.css'
import "./resources/styles/style.css"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ArmiesPage from './pages/Armies/armies'
import 'bootstrap/dist/css/bootstrap.min.css';
import ArmyPage from './pages/Onearmy/onearmy'
import MainPage from './pages/Mainpage/mainpage'
import { Provider } from 'react-redux'
import { store } from './store'
import LoginPage from './pages/LoginPage/loginpage'
import RegisterPage from './pages/RegisterPage/registerpage'
import TravelTimePage from './pages/TravelTime/TravelTime'
import HistorianLKS from './pages/Historianlks/HistorianLKS'
//import { Navigate } from 'react-router-dom'
import TravelTimesPage from './pages/TravelTimes/TravelTimes'

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
  },
  {
    path: '/reg',
    element: <RegisterPage />
  },
  {
    path: '/auth',
    element: <LoginPage />
  },
  {
    path: '/travel_time/:ttid',
    element: <TravelTimePage />
  },
  {
    path: '/travel_times',
    element: <TravelTimesPage />
  },
  {
    path: '/historian_lks',
    element: <HistorianLKS />
  },
  {
    path: '/test',
    element: <h1>TeST PAGE</h1>
  }
  // {
  //   path: '*',
  //   element: <Navigate to="/" replace />
  // }
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
