import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Modal, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

import { 
    getOwnCarsRetrieveRequest,
    updateOwnCarRequest,
    deleteOwnCarRequest,
    getExpensesListRequest,
    createExpensesRequest,
    deleteExpensesRequest,
    deletePhotoCarRequest,
} from '../../../requests/cars/own';
import { getBrandsListRequest, getModelsListRequest } from '../../../requests/cars';

import { HighlightedButton } from '../../../components/buttons/HighlightedButton';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';

import { MYCARS } from '../../../utils/urls/cars';

import { COLORS } from '../../../components/Colors';

const EXPENSE_TYPES = {
    repaid: "Ремонт",
    documents: "Документы",
    delivery: "Доставка",
    other: "Прочее",
};

const ExpenseElement = ({ expense, onDelete }) => {
    return (
        <Card className="mb-3" style={{ width: '18rem', backgroundColor: COLORS.secondary, borderBlockColor: COLORS.highlight }}>
            <Card.Body>
                <Card.Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {EXPENSE_TYPES[expense.expense_type]}
                        <FaTrash
                            className="mr-2"
                            style={{ cursor: 'pointer', color: COLORS.highlight }}
                            onClick={() => onDelete(expense.id)} // Передаем ID расхода
                        />
                    </div>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    <b>Дата:</b> {expense.date}
                </Card.Subtitle>
                <Card.Text>
                    <b>Сумма:</b> {expense.amount} ₽ <br />
                    <b>Описание:</b> {expense.description || 'Не указано'}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

const PhotosBlock = ({ photos, onUploadPhoto, onDeletePhoto }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            onUploadPhoto(selectedFile);
            setSelectedFile(null); // Очистка выбранного файла после загрузки
        }
    };

    return (
        <div>
            <h2>Фотографии</h2>
            <Row>
                <Col md={8}>
                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Col>
                <Col md={4}>
                    <PrimaryButton className="w-100" onClick={handleUpload} disabled={!selectedFile}>
                        Загрузить
                    </PrimaryButton>
                </Col>
            </Row>
            <br />
            <Row className="mb-3">
                {photos.map((photo, index) => (
                    <Col key={index} md={3} className="mb-3">
                        <Card style={{ position: 'relative' }}>
                            <Card.Img variant="top" src={photo.url} alt={`Фото ${index + 1}`} />
                            <FaTrash
                                style={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    color: 'red',
                                    cursor: 'pointer',
                                }}
                                onClick={() => onDeletePhoto(photo.id)} // Передаем ID фото
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

const OwnCarsViewPage = () => {
    const navigate = useNavigate();

    const { my_car_id } = useParams();
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
    });
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [expenses, setExpenses] = useState([]);
    const [showExpenseModal, setShowExpenseModal] = useState(false); // Управление видимостью попапа
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        date: '',
        expense_type: 'repaid', // Значение по умолчанию
    });
    const [photos, setPhotos] = useState([]);

    const handleShowExpenseModal = () => {
        setNewExpense({ description: '', amount: '', date: '', expense_type: 'repaid' }); // Устанавливаем значение по умолчанию
        setShowExpenseModal(true);
    };
    const handleCloseExpenseModal = () => setShowExpenseModal(false);

    const handleUploadPhoto = async (file) => {
        const formData = new FormData();
        formData.append("photos", file);
    
        try {
            const response = await updateOwnCarRequest(my_car_id, formData);
            if (response.ok) {
                await fetchCarData();
            } else {
                const errorData = await response.json();
                alert('Ошибка при загрузке фотографии: ' + JSON.stringify(errorData));
            }
        } catch (err) {
            console.error('Ошибка при загрузке фотографии:', err);
            alert('Произошла ошибка при загрузке фотографии.');
        }
    };
    const handleDeletePhoto = async (photoId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту фотографию?')) {
            try {
                const response = await deletePhotoCarRequest(photoId); // Запрос на удаление фото
                if (response.ok) {
                    setPhotos(photos.filter((photo) => photo.id !== photoId)); // Обновляем список фото
                } else {
                    const errorData = await response.json();
                    alert('Ошибка при удалении фотографии: ' + JSON.stringify(errorData));
                }
            } catch (err) {
                console.error('Ошибка при удалении фотографии:', err);
                alert('Произошла ошибка при удалении фотографии.');
            }
        }
    };

    const fetchCarData = async () => {
        try {
            const response = await getOwnCarsRetrieveRequest(my_car_id);
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    vin: data.vin,
                    brand: data.brand.id,
                    model: data.model.id,
                    year: data.year,
                    mileage: data.mileage,
                    purchase_price: data.purchase_price,
                    status: data.status,
                    purchase_date: data.purchase_date,
                    sale_price: data.sale_price || '',
                    sale_date: data.sale_date || '',
                    description: data.description || '',
                    seller_info: data.seller_info || '',
                    buyer_info: data.buyer_info || '',
                });
                setPhotos(data.photos); // Сохраняем фотографии
                return data.brand.id;
            } else {
                setError('Failed to load car data');
            }
        } catch (err) {
            setError('An error occurred while fetching car data');
        }
    };    

    const fetchBrands = async () => {
        try {
            const response = await getBrandsListRequest();
            if (response.ok) {
                const data = await response.json();
                setBrands(data);
                return data;
            }
        } catch (err) {
            console.error('Ошибка загрузки брендов:', err);
        }
    };

    const fetchModels = async (brandId) => {
        try {
            const response = await getModelsListRequest(brandId);
            if (response.ok) {
                const data = await response.json();
                setModels(data);
                return data;
            }
        } catch (err) {
            console.error('Ошибка загрузки моделей:', err);
        }
    };

    const handleBrandChange = (brandId) => {
        setFormData({ ...formData, brand: brandId, model: '' });
        fetchModels(brandId);
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSaveCar = async () => {
        try {
            // Очищаем данные формы перед отправкой
            const cleanedFormData = { ...formData };
    
            // Преобразуем пустые строки в null для полей дат
            ['purchase_date', 'sale_date'].forEach((dateField) => {
                if (cleanedFormData[dateField] === '') {
                    cleanedFormData[dateField] = null;
                }
            });
    
            const response = await updateOwnCarRequest(my_car_id, {
                ...cleanedFormData,
                brand: formData.brand, // Уже ID
                model: formData.model, // Уже ID
            });
    
            if (response.ok) {
                navigate(MYCARS);
            } else {
                const errorData = await response.json();
                alert('Ошибка: ' + JSON.stringify(errorData));
            }
        } catch (err) {
            console.error('Ошибка при сохранении данных машины:', err);
            alert('Произошла ошибка при сохранении данных.');
        }
    };    
    
    const handleDeleteCar = async () => {
        if (window.confirm('Вы уверены, что хотите удалить эту машину?')) {
            try {
                const response = await deleteOwnCarRequest(my_car_id);
                if (response.ok) {
                    navigate(MYCARS);
                } else {
                    const errorData = await response.json();
                    alert('Ошибка: ' + JSON.stringify(errorData));
                }
            } catch (err) {
                console.error('Ошибка при удалении машины:', err);
                alert('Произошла ошибка при удалении машины.');
            }
        }
    };

    const handleExpenseInputChange = (field, value) => {
        setNewExpense({ ...newExpense, [field]: value });
    };

    const handleSaveExpense = async () => {
        try {
            const response = await createExpensesRequest({
                vehicle: my_car_id,
                ...newExpense, // Отправляем данные нового расхода
            });
    
            if (response.ok) {
                const createdExpense = await response.json();
                setExpenses([...expenses, createdExpense]); // Добавляем новый расход в список
                setNewExpense({ description: '', amount: '', date: '', expense_type: 'repaid' }); // Сброс формы
                handleCloseExpenseModal();
            } else {
                const errorData = await response.json();
                alert('Ошибка при добавлении расхода: ' + JSON.stringify(errorData));
            }
        } catch (err) {
            console.error('Ошибка при сохранении расхода:', err);
            alert('Произошла ошибка при сохранении расхода.');
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот расход?')) {
            try {
                const response = await deleteExpensesRequest(expenseId);
                if (response.ok) {
                    setExpenses(expenses.filter(expense => expense.id !== expenseId)); // Удаляем расход из списка
                } else {
                    alert('Ошибка при удалении расхода');
                }
            } catch (err) {
                console.error('Ошибка при удалении расхода:', err);
                alert('Произошла ошибка при удалении расхода.');
            }
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const brandIdFromCar = await fetchCarData();
                await fetchBrands();
                if (brandIdFromCar) {
                    await fetchModels(brandIdFromCar);
                }
                // Получение списка затрат
                const expensesResponse = await getExpensesListRequest(my_car_id);
                if (expensesResponse.ok) {
                    const expensesData = await expensesResponse.json();
                    setExpenses(expensesData); // Устанавливаем затраты из ответа сервера
                } else {
                    console.error('Ошибка при загрузке списка затрат');
                }
            } catch (err) {
                console.error('Ошибка инициализации страницы:', err);
            } finally {
                setLoading(false);
            }
        };
    
        init();
    }, [my_car_id]);

    if (loading) {
        return (
            <Container className="mt-4">
                <h1>Loading...</h1>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <h1>Error</h1>
                <p>{error}</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col>
                    <h1>Редактировать машину</h1>
                </Col>
            </Row>
            <Form>
                <Row className="mb-3">
                    <h3>Основные данные</h3>
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
                            value={formData.brand} // Используем ID бренда
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
                            value={formData.model} // Используем ID модели
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
                                required
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
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
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
                <br />
                <Row>
                    <Col md={6}>
                        <HighlightedButton className="w-100" onClick={handleSaveCar}>
                            Сохранить
                        </HighlightedButton>
                    </Col>
                    <Col md={6}>
                        <PrimaryButton className="w-100" onClick={handleDeleteCar}>
                            Удалить
                        </PrimaryButton>
                    </Col>
                </Row>
            </Form>

            <br />
            <hr />
            <PhotosBlock
                photos={photos}
                onUploadPhoto={handleUploadPhoto}
                onDeletePhoto={handleDeletePhoto}
            />


            <br />
            <hr />
            <div>
                <h2>Расходы</h2>
                <Row>
                    <Col md={3}>
                        <PrimaryButton className="w-100" onClick={handleShowExpenseModal}>
                            Добавить
                        </PrimaryButton>
                    </Col>
                </Row>
                <br />
                <Row>
                    {expenses.map((expense, index) => (
                        <Col key={index} md={3}> {/* 4 колонки на строку */}
                            <ExpenseElement expense={expense} onDelete={handleDeleteExpense} />
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Модальное окно для добавления расходов */}
            <Modal show={showExpenseModal} onHide={handleCloseExpenseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить расход</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="expenseType">
                            <Form.Label>Тип расхода</Form.Label>
                            <Form.Select
                                value={newExpense.expense_type}
                                onChange={(e) => handleExpenseInputChange('expense_type', e.target.value)}
                            >
                                {Object.entries(EXPENSE_TYPES).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="expenseAmount">
                            <Form.Label>Сумма</Form.Label>
                            <Form.Control
                                type="number"
                                value={newExpense.amount}
                                onChange={(e) => handleExpenseInputChange('amount', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="expenseDate">
                            <Form.Label>Дата</Form.Label>
                            <Form.Control
                                type="date"
                                value={newExpense.date}
                                onChange={(e) => handleExpenseInputChange('date', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="expenseDescription">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newExpense.description}
                                onChange={(e) => handleExpenseInputChange('description', e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <PrimaryButton onClick={handleSaveExpense}>
                        Сохранить
                    </PrimaryButton>
                    <HighlightedButton onClick={handleCloseExpenseModal}>
                        Закрыть
                    </HighlightedButton>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OwnCarsViewPage;

