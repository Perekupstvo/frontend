import React from 'react';

export const StatusElement = ({ status }) => {
    const translateStatus = (status) => {
        const translations = {
            'for_sale': 'В продаже',
            'sold': 'Продан',
            'in_progress': 'В работе',
        };
        return translations[status] || status;
    };

    const getStatusStyle = (status) => {
        const styles = {
            'for_sale': { backgroundColor: '#f8d7da', color: '#721c24' }, // Красный
            'sold': { backgroundColor: '#d4edda', color: '#155724' }, // Зеленый
            'in_progress': { backgroundColor: '#fff3cd', color: '#856404' }, // Желтый
        };
        return styles[status] || { backgroundColor: '#f1f1f1', color: '#000' }; // По умолчанию
    };

    return (
        <div
            style={{
                display: 'inline-block',
                padding: '1px 3px',
                borderRadius: '5px',
                ...getStatusStyle(status),
            }}
        >
            {translateStatus(status)}
        </div>
    );
};
