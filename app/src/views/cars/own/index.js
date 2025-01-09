import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/buttons/SecondaryButton';
import { HighlightedButton } from '../../../components/buttons/HighlightedButton';

import { getOwnCarsListRequest } from '../../../requests/cars/own';

import { MYCARS_CREATE } from '../../../utils/urls/cars';

import { getMyCarViewUrl } from '../../../utils/urls/cars';

import { OwnCarListCard } from '../../../components/cars/own/OwnCarListCard';

const translateStatus = (status) => {
    const translations = {
        'for_sale': 'В продаже',
        'sold': 'Продан',
        'in_progress': 'В работе',
    };
    return translations[status] || status;
};

const OwnCarsPage = () => {
    const [cars, setCars] = useState([]);
    const [filters, setFilters] = useState({
        brand: '',
        model: '',
        status: '',
        yearFrom: '',
        yearTo: '',
        mileageFrom: '',
        mileageTo: '',
        purchasePriceFrom: '',
        purchasePriceTo: '',
    });

    const fetchCars = async (queryParams = {}) => {
        try {
            const query = new URLSearchParams(queryParams).toString();
            const response = await getOwnCarsListRequest(query);
            const data = await response.json();
            setCars(data);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    const handleApplyFilters = () => {
        const queryParams = {
            brand: filters.brand,
            model: filters.model,
            status: filters.status,
            year_from: filters.yearFrom,
            year_to: filters.yearTo,
            mileage_from: filters.mileageFrom,
            mileage_to: filters.mileageTo,
            purchase_price_from: filters.purchasePriceFrom,
            purchase_price_to: filters.purchasePriceTo,
        };

        fetchCars(queryParams);
    };

    const handleResetFilters = () => {
        setFilters({
            brand: '',
            model: '',
            status: '',
            yearFrom: '',
            yearTo: '',
            mileageFrom: '',
            mileageTo: '',
            purchasePriceFrom: '',
            purchasePriceTo: '',
        });
        fetchCars(); // Загружаем все данные без фильтров
    };

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col>
                    <h1>Мои машины</h1>
                </Col>
            </Row>

            <Form className="mb-4">
                <Row>
                    <Col md={3}>
                        <Form.Group controlId="filter-brand">
                            <Form.Label>Марка</Form.Label>
                            <Form.Select
                                value={filters.brand}
                                onChange={(e) => handleFilterChange('brand', e.target.value)}
                            >
                                <option value="">Все</option>
                                {[...new Set(cars.map((car) => car.brand))].map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="filter-model">
                            <Form.Label>Модель</Form.Label>
                            <Form.Select
                                value={filters.model}
                                onChange={(e) => handleFilterChange('model', e.target.value)}
                            >
                                <option value="">Все</option>
                                {[...new Set(cars.map((car) => car.model))].map((model) => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="filter-status">
                            <Form.Label>Статус</Form.Label>
                            <Form.Select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">Все</option>
                                {[...new Set(cars.map((car) => car.status))].map((status) => (
                                    <option key={status} value={status}>{translateStatus(status)}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md={3}>
                        <Form.Group controlId="filter-year">
                            <Form.Label>Год (от - до)</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="От"
                                        value={filters.yearFrom}
                                        onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="До"
                                        value={filters.yearTo}
                                        onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="filter-mileage">
                            <Form.Label>Пробег (от - до)</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="От"
                                        value={filters.mileageFrom}
                                        onChange={(e) => handleFilterChange('mileageFrom', e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="До"
                                        value={filters.mileageTo}
                                        onChange={(e) => handleFilterChange('mileageTo', e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="filter-purchase-price">
                            <Form.Label>Цена покупки (от - до)</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="От"
                                        value={filters.purchasePriceFrom}
                                        onChange={(e) => handleFilterChange('purchasePriceFrom', e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="До"
                                        value={filters.purchasePriceTo}
                                        onChange={(e) => handleFilterChange('purchasePriceTo', e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md={2}>
                        <HighlightedButton className="w-100" onClick={handleApplyFilters}>
                            Применить
                        </HighlightedButton>
                    </Col>
                    <Col md={2}>
                        <PrimaryButton className="w-100" onClick={handleResetFilters}>
                            Сбросить
                        </PrimaryButton>
                    </Col>
                </Row>
            </Form>

            <hr />

            <Row className="mb-3">
                <Col className="text-start">
                    <Link as={Link} to={MYCARS_CREATE}>
                        <PrimaryButton>
                            Добавить машину
                        </PrimaryButton>
                    </Link>
                </Col>
            </Row>

            {/* Список машин */}
            <Row>
                {cars.map((car) => (
                    <Col md={4} key={car.id} className="mb-4">
                        <OwnCarListCard car={car} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default OwnCarsPage;
