import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import 'react-toggle/style.css';

import { AuthenticationRoutePath } from '../routers/AppRouter';
import { PROFILE } from '../utils/urls/profile';
import { MYCARS, STATISTIC } from '../utils/urls/cars';
import { discardTokens } from '../utils/token_utils';

import { COLORS } from './Colors';

const MyNavbar = () => {
    const location = useLocation(); // Получаем текущий путь

    const navbarStyle = {
        width: '80px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#F3D8C7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '30px',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    };

    const ulStyle = {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
    };

    const liStyle = (isActive) => ({
        textAlign: 'center',
        backgroundColor: isActive ? COLORS.hovored : COLORS.primary, // Выделяем активный элемент
        width: '100%',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        transition: 'background-color 0.3s, transform 0.3s',
        flexDirection: 'column',
        fontSize: '10px',
    });

    const iconStyle = {
        width: '35px',
        height: '35px',
    };

    const logoutStyle = {
        marginTop: 'auto',
        width: '100%',
    };

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleLogout = () => {
        discardTokens();
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                handleGoBack();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    });

    return (
        <div style={navbarStyle}>
            <ul style={ulStyle}>
                <li
                    style={liStyle(location.pathname === PROFILE)} // Проверяем текущий путь
                >
                    <Link
                        to={PROFILE}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            textDecoration: 'none',
                            color: 'inherit',
                            flexDirection: 'column',
                        }}
                    >
                        <img style={iconStyle} src="images/nav/profile.png" alt="Profile" />
                        <b>Профиль</b>
                    </Link>
                </li>
                <li
                    style={liStyle(location.pathname === MYCARS)} // Проверяем текущий путь
                >
                    <Link
                        to={MYCARS}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            textDecoration: 'none',
                            color: 'inherit',
                            flexDirection: 'column',
                        }}
                    >
                        <img style={iconStyle} src="images/nav/car.png" alt="Cars" />
                        <b>Машины</b>
                    </Link>
                </li>
                <li
                    style={liStyle(location.pathname === STATISTIC)} // Проверяем текущий путь
                >
                    <Link
                        to={STATISTIC}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            textDecoration: 'none',
                            color: 'inherit',
                            flexDirection: 'column',
                        }}
                    >
                        <img style={iconStyle} src="images/nav/statistic.png" alt="statistic" />
                        <b>Статистика</b>
                    </Link>
                </li>
            </ul>
            <div
                style={{
                    ...logoutStyle,
                    ...liStyle(false),
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.hovored)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.primary)}
            >
                <Link
                    to={AuthenticationRoutePath}
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        textDecoration: 'none',
                        color: 'inherit',
                        flexDirection: 'column',
                    }}
                >
                    <img style={iconStyle} src="images/nav/logout.png" alt="Logout" />
                    <b>Выход</b>
                </Link>
            </div>
        </div>
    );
};

export default MyNavbar;
