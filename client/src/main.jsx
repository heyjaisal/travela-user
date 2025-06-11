import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from "./redux/Store.jsx";
import { Provider } from "react-redux";
import App from './App.jsx'
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
