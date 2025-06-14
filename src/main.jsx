import 'bootswatch/dist/darkly/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import  './styles/header.css';
import './styles/profile.css';
import './styles/friend.css';
import './styles/errors.css';
import './styles/edit_form.css';
import './styles/login.css'
import './styles/register.css'
import './styles/news.css'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
