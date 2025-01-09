import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Nav, Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

import CountUp from 'react-countup';
import { COLORS } from '../../../components/Colors';
import { getUserStatisticRequest } from '../../../requests/cars/own';


// Регистрируем компоненты Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


// Форматирование числа
const formatNumber = (number) => {
    return new Intl.NumberFormat('ru-RU').format(number);
};

// Компонент карточки статистики
const StatisticCard = ({ title, value, icon, with_rubles = false, color }) => (
    <Card style={{ border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Card.Body className="text-center">
            <div style={{ fontSize: '2rem', color }}>{icon}</div>
            <h5 className="mt-2">{title}</h5>
            <h3 className="mt-2" style={{ color: 'black' }}>
                <CountUp start={0} end={value} duration={2} formattingFn={formatNumber} />
                {with_rubles && ' ₽'}
            </h3>
        </Card.Body>
    </Card>
);

const CommonStatisticBlock = ({ statistics }) => (
    <Row className="g-4">
        <Col md={3}>
            <StatisticCard
                title="Всего машин"
                value={statistics.vehicle_count}
                icon="🚗"
                color="#4CAF50"
            />
        </Col>
        <Col md={3}>
            <StatisticCard
                title="В продаже"
                value={statistics.vehicle_by_status.for_sale}
                icon="📈"
                color="#2196F3"
            />
        </Col>
        <Col md={3}>
            <StatisticCard
                title="В работе"
                value={statistics.vehicle_by_status.in_progress}
                icon="🔧"
                color="#FFC107"
            />
        </Col>
        <Col md={3}>
            <StatisticCard
                title="Продано"
                value={statistics.vehicle_by_status.sold}
                icon="💼"
                color="#673AB7"
            />
        </Col>
    </Row>
);

const FinancialStatisticBlock = ({ statistics }) => (
    <div>
        {/* Ряд 1: Куплено, Продано, Заработано */}
        <Row className="g-4">
            <Col md={4}>
                <StatisticCard
                    title="Куплено на"
                    value={statistics.deals_data.purchase_total_amount}
                    icon="💰"
                    with_rubles
                    color="#FF5722"
                />
            </Col>
            <Col md={4}>
                <StatisticCard
                    title="Продано на"
                    value={statistics.deals_data.sold_total_amount}
                    icon="📊"
                    with_rubles
                    color="#009688"
                />
            </Col>
            <Col md={4}>
                <StatisticCard
                    title="Заработано"
                    value={statistics.deals_data.benefit}
                    icon="🏆"
                    with_rubles
                    color="#4CAF50"
                />
            </Col>
        </Row>

        {/* Ряд 2: Средние цены покупки/продажи */}
        <Row className="g-4 mt-4">
            <Col md={4}>
                <StatisticCard
                    title="Средняя цена покупки"
                    value={statistics.deals_data.purchase_avg_price}
                    icon="🛒"
                    with_rubles
                    color="#3F51B5"
                />
            </Col>
            <Col md={4}>
                <StatisticCard
                    title="Средняя цена продажи"
                    value={statistics.deals_data.sold_avg_price}
                    icon="📈"
                    with_rubles
                    color="#E91E63"
                />
            </Col>
            <Col md={4}>
                <StatisticCard
                    title="Среднее кол-во дней между покупкой и продажей"
                    value={statistics.deals_data.avg_days_between_purchase_and_sale}
                    icon="⏳"
                    color="#FFC107"
                />
            </Col>
        </Row>

        {/* Ряд 3: Машины с прибылью/убытком */}
        <Row className="g-4 mt-4">
            <Col md={6}>
                <StatisticCard
                    title="Машины с прибылью"
                    value={statistics.deals_data.vehicle_with_benefits}
                    icon="✅"
                    color="#4CAF50"
                />
            </Col>
            <Col md={6}>
                <StatisticCard
                    title="Машины с убытком"
                    value={statistics.deals_data.vehicle_with_losses}
                    icon="❌"
                    color="#F44336"
                />
            </Col>
        </Row>

        {/* Ряд 4: Расходы по категориям */}
        <Row className="g-4 mt-4">
            <Col md={3}>
                <StatisticCard
                    title="Ремонт"
                    value={statistics.expenses_by_status.repaid}
                    icon="🔧"
                    with_rubles
                    color="#2196F3"
                />
            </Col>
            <Col md={3}>
                <StatisticCard
                    title="Документы"
                    value={statistics.expenses_by_status.documents}
                    icon="📄"
                    with_rubles
                    color="#FFC107"
                />
            </Col>
            <Col md={3}>
                <StatisticCard
                    title="Доставка"
                    value={statistics.expenses_by_status.delivery}
                    icon="🚚"
                    with_rubles
                    color="#FF5722"
                />
            </Col>
            <Col md={3}>
                <StatisticCard
                    title="Прочее"
                    value={statistics.expenses_by_status.other}
                    icon="📦"
                    with_rubles
                    color="#9E9E9E"
                />
            </Col>
        </Row>
    </div>
);


const CombinedGraphsTab = ({ graphData, financialData }) => {
    const [chartDataOperations, setChartDataOperations] = useState(null);
    const [chartDataFinancial, setChartDataFinancial] = useState(null);

    // Обработка данных для графика операций
    useEffect(() => {
        if (graphData) {
            const purchaseDates = graphData.purchase_dates.map((item) => item.date);
            const purchaseCounts = graphData.purchase_dates.map((item) => item.count);

            const saleDates = graphData.sale_dates.map((item) => item.date);
            const saleCounts = graphData.sale_dates.map((item) => item.count);

            setChartDataOperations({
                labels: purchaseDates,
                datasets: [
                    {
                        label: 'Покупки',
                        data: purchaseCounts,
                        borderColor: COLORS.highlight,
                        backgroundColor: `${COLORS.highlight}33`,
                        fill: true,
                    },
                    {
                        label: 'Продажи',
                        data: saleCounts,
                        borderColor: COLORS.primary,
                        backgroundColor: `${COLORS.primary}33`,
                        fill: true,
                    },
                ],
            });
        }
    }, [graphData]);

    // Обработка данных для финансового графика
    useEffect(() => {
        if (financialData) {
            const purchaseDates = financialData.purchase_dates.map((item) => item.date);
            const purchaseAmounts = financialData.purchase_dates.map((item) => item.amount);

            const saleDates = financialData.sale_dates.map((item) => item.date);
            const saleAmounts = financialData.sale_dates.map((item) => item.amount);

            setChartDataFinancial({
                labels: purchaseDates,
                datasets: [
                    {
                        label: 'Затраты',
                        data: purchaseAmounts,
                        borderColor: COLORS.highlight,
                        backgroundColor: `${COLORS.highlight}33`,
                        fill: true,
                    },
                    {
                        label: 'Доходы',
                        data: saleAmounts,
                        borderColor: COLORS.primary,
                        backgroundColor: `${COLORS.primary}33`,
                        fill: true,
                    },
                ],
            });
        }
    }, [financialData]);

    return (
        <Container className="mt-4">
            <Row>
                <Col md={6}>
                    <h5 className="text-center mb-3">График операций</h5>
                    {chartDataOperations ? (
                        <Line
                            data={chartDataOperations}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => `${context.dataset.label}: ${context.raw}`,
                                        },
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Дата',
                                        },
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Количество',
                                        },
                                        beginAtZero: true,
                                    },
                                },
                            }}
                            style={{ maxHeight: '300px' }}
                        />
                    ) : (
                        <p className="text-center">Загрузка данных...</p>
                    )}
                </Col>

                <Col md={6}>
                    <h5 className="text-center mb-3">Финансовый график</h5>
                    {chartDataFinancial ? (
                        <Line
                            data={chartDataFinancial}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => `${context.dataset.label}: ${context.raw} ₽`,
                                        },
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Дата',
                                        },
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Сумма (₽)',
                                        },
                                        beginAtZero: true,
                                    },
                                },
                            }}
                            style={{ maxHeight: '300px' }}
                        />
                    ) : (
                        <p className="text-center">Загрузка данных...</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};


const OwnCarsStatisticPage = () => {
    const [statistics, setStatistics] = useState({
        vehicle_by_status: { for_sale: 0, in_progress: 0, sold: 0 },
        expenses_by_status: { repaid: 0, documents: 0, delivery: 0, other: 0 }, // Сумма расходов по статусам
        deals_data: { 
            purchase_total_amount: 0,
            sold_total_amount: 0,
            benefit: 0,
            purchase_avg_price: 0,
            sold_avg_price: 0,
            avg_days_between_purchase_and_sale: 0,
            vehicle_with_benefits: 0,
            vehicle_with_losses: 0,
        },
        graph_datasets: {
            count_dataset: {
                purchase_dates: [],
                sale_dates: [],
            },
            financial_dataset: {
                purchase_dates: [],
                sale_dates: [],
            }
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUserStatisticRequest();
                const data = await response.json();
                setStatistics(data);
            } catch (error) {
                console.error('Failed to fetch statistics', error);
            }
        };
        fetchData();
    }, []);

    return (
        <Container className="mt-5">
            <Tab.Container defaultActiveKey="common">
                <Nav variant="pills" className="mb-4" style={{ justifyContent: 'center' }}>
                    <Nav.Item>
                        <Nav.Link eventKey="common">Общие</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="financial">Финансовые</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="Graphs">Графики</Nav.Link>
                    </Nav.Item>
                    {/* <Nav.Item>
                        <Nav.Link eventKey="Cars">Статистика по машинам</Nav.Link>
                    </Nav.Item> */}
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="common">
                        <CommonStatisticBlock statistics={statistics} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="financial">
                        <FinancialStatisticBlock statistics={statistics} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="Graphs">
                        <CombinedGraphsTab
                            graphData={statistics.graph_datasets.count_dataset}
                            financialData={statistics.graph_datasets.financial_dataset}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="Cars">
                        <div className="text-center">
                            <h3>В разработке</h3>
                        </div>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
};

export default OwnCarsStatisticPage;
