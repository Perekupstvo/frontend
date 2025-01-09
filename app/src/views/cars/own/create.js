import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { createOwnCarRequest } from '../../../requests/cars/own';
import { getBrandsListRequest, getModelsListRequest } from '../../../requests/cars/index';

import { HighlightedButton } from '../../../components/buttons/HighlightedButton';

import { MYCARS } from '../../../utils/urls/cars';

const OwnCarsCreatePage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        vin: '',
        brand: '',
        model: '',
        year: '',
        mileage: '',
        purchase_price: '',
        status: 'for_sale',
        purchase_date: '',
        sale_price: '',
        sale_date: '',
        description: '',
        buyer_info: '',
        seller_info: '',
    });

    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const cleanFormData = (data) => {
        const cleanedData = { ...data };
        // Явно заменяем пустые строки на null для всех полей, где это применимо
        Object.keys(cleanedData).forEach((key) => {
            if (cleanedData[key] === '') {
                cleanedData[key] = null;
            }
        });
        return cleanedData;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Чистим данные перед отправкой
        const cleanedFormData = cleanFormData(formData);
    
        try {
            const response = await createOwnCarRequest(cleanedFormData);
            if (response.ok) {
                setFormData({
                    vin: '',
                    brand: '',
                    model: '',
                    year: '',
                    mileage: '',
                    purchase_price: '',
                    status: 'for_sale',
                    purchase_date: '',
                    sale_price: '',
                    sale_date: '',
                    description: '',
                    buyer_info: '',
                    seller_info: '',
                });
                navigate(MYCARS);
            } else {
                const errorData = await response.json();
                alert('Ошибка: ' + JSON.stringify(errorData));
            }
        } catch (error) {
            console.error('Ошибка при создании машины:', error);
            alert('Произошла ошибка при отправке данных.');
        }
    };
    

    const fetchBrands = async () => {
        try {
            const response = await getBrandsListRequest();
            const data = await response.json();
            setBrands(data);
        } catch (error) {
            console.error('Ошибка при загрузке брендов:', error);
        }
    };

    const fetchModels = async (brandId = null) => {
        try {
            const response = await getModelsListRequest(brandId);
            const data = await response.json();
            setModels(data);
        } catch (error) {
            console.error('Ошибка при загрузке моделей:', error);
        }
    };

    const handleBrandChange = (brandId) => {
        handleInputChange('brand', brandId);
        fetchModels(brandId || null); // Если бренд не выбран, загружаем все модели
    };

    useEffect(() => {
        fetchBrands();
        fetchModels(); // Загружаем все модели по умолчанию
    }, []);

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col>
                    <h1>Добавить машину</h1>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit}>
                <h3>Основные данные</h3>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="vin">
                            <Form.Label>VIN<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.vin}
                                onChange={(e) => handleInputChange('vin', e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="brand">
                            <Form.Label>Марка<span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={formData.brand}
                                onChange={(e) => handleBrandChange(e.target.value)}
                                required
                            >
                                <option value="">Выберите марку</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="model">
                            <Form.Label>Модель<span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={formData.model}
                                onChange={(e) => handleInputChange('model', e.target.value)}
                                required
                            >
                                <option value="">Выберите модель</option>
                                {models.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="year">
                            <Form.Label>Год выпуска<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.year}
                                onChange={(e) => handleInputChange('year', e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="mileage">
                            <Form.Label>Пробег<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.mileage}
                                onChange={(e) => handleInputChange('mileage', e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="description">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="status">
                            <Form.Label>Статус<span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                required
                            >
                                <option value="for_sale">В продаже</option>
                                <option value="in_progress">В работе</option>
                                <option value="sold">Продан</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <hr />
                <h3>Данные о покупке</h3>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="purchasePrice">
                            <Form.Label>Цена покупки</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.purchase_price}
                                onChange={(e) => handleInputChange('purchase_price', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="purchaseDate">
                            <Form.Label>Дата покупки</Form.Label>
                            <Form.Control
                                type="date"
                                value={formData.purchase_date}
                                onChange={(e) => handleInputChange('purchase_date', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="seller_info">
                            <Form.Label>Информация о продавце</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.seller_info}
                                onChange={(e) => handleInputChange('seller_info', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <hr />
                <h3>Данные о продаже</h3>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="salePrice">
                            <Form.Label>Цена продажи</Form.Label>
                            <Form.Control
                                type="number"
                                value={formData.sale_price}
                                onChange={(e) => handleInputChange('sale_price', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="saleDate">
                            <Form.Label>Дата продажи</Form.Label>
                            <Form.Control
                                type="date"
                                value={formData.sale_date}
                                onChange={(e) => handleInputChange('sale_date', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="buyer_info">
                            <Form.Label>Информация о покупателе</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.buyer_info}
                                onChange={(e) => handleInputChange('buyer_info', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <HighlightedButton type="submit" className="w-100">
                            Добавить машину
                        </HighlightedButton>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default OwnCarsCreatePage;
