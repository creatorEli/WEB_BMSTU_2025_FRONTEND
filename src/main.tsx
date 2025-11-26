import './index.css'
import "./resources/styles/style.css"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import StartPage from './names'
import ArmiesPage from './pages/Armies/armies'
import 'bootstrap/dist/css/bootstrap.min.css';
import ArmyPage from './pages/Onearmy/onearmy'
import MainPage from './pages/Mainpage/mainpage'
import { Provider } from 'react-redux'
import { store } from './store'
// import { registerSW } from "virtual:pwa-register";

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
], {
  basename: import.meta.env.BASE_URL  // для гитхаба
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)

// if ("serviceWorker" in navigator) {
//   registerSW()
// }