import { createRoot } from 'react-dom/client';
import './styles.css';
import {store} from './redux/store';
import { Provider } from 'react-redux';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    
    <App />
    
  </Provider>,
)
