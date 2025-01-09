import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { getMyCarViewUrl } from '../../../utils/urls/cars';
import { SecondaryButton } from '../../buttons/SecondaryButton';

import { StatusElement } from '../StatusElement';

export const OwnCarListCard = ({ car }) => {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{car.brand} {car.model}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">VIN: {car.vin}</Card.Subtitle>
                <Card.Text>
                    <b>Год:</b> {car.year} <br />
                    <b>Пробег:</b> {car.mileage} км <br />
                    <b>Статус:</b> <StatusElement status={car.status} /> <br />
                    <b>Цена покупки:</b> {car.purchase_price ? `${car.purchase_price} ₽` : 'Не указана'} <br />
                    <b>Цена продажи:</b> {car.sale_price ? `${car.sale_price} ₽` : 'Не указана'}
                    {
                        car.expenses_amount > 0 &&
                        <p>
                            <b>Затраты: </b> {car.expenses_amount} ₽
                        </p>
                    }
                    {
                        car.purchase_price && car.sale_price &&
                        <p>
                            <b>Выгода: </b> 
                            <span style={{
                                color: car.benefit > 0 ? 'green' : 'red'
                            }}>
                                {car.benefit} ₽
                            </span>
                        </p>
                    }
                </Card.Text>
                <Link as={Link} to={getMyCarViewUrl(car.id)}>
                    <SecondaryButton variant="primary" className="me-2">Подробнее</SecondaryButton>
                </Link>
            </Card.Body>
        </Card>
    );
};
