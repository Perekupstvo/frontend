import React from 'react';
import MyNavbar from '../components/Navbar.js';

import { Navigate, useLocation } from 'react-router-dom';
import { checkTokenExist } from '../utils/token_utils';
import { NotificationContainer } from 'react-notifications';
import { AuthenticationRoutePath } from '../routers/AppRouter';

import './style.css';

const PageTemplate = ({ children, title = 'Flip Cars', show_navbar = true, check_token = true }) => {
    document.title = title;
    const location = useLocation();

    // Проверка на токен
    if (!(location.pathname === AuthenticationRoutePath) && check_token && !checkTokenExist()) {
        return <Navigate to={AuthenticationRoutePath} />;
    }

    // Стиль для контейнера с учетом навбара
    const contentStyle = {
        marginLeft: show_navbar ? '80px' : '0', // Учитываем ширину навбара
        padding: '20px', // Добавляем внутренний отступ для контента
        minHeight: '100vh', // Минимальная высота страницы
    };

    return (
        <div>
            {show_navbar && <MyNavbar />}
            <div style={contentStyle}>
                {children}
            </div>
            <NotificationContainer />
        </div>
    );
};

export default PageTemplate;
