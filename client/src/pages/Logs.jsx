import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Breadcrumb, Spinner, Badge } from 'react-bootstrap';
import { getLogsYears, getLogsMonths, getLogsDays, getDayDetails, searchLogs } from '../services/api';

const Logs = () => {
    const [view, setView] = useState('years'); // years, months, days, details, search
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadYears();
    }, []);

    const loadYears = async () => {
        setLoading(true);
        try {
            const res = await getLogsYears();
            setData(res.data);
            setView('years');
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleYearClick = async (year) => {
        setSelectedYear(year);
        setLoading(true);
        try {
            const res = await getLogsMonths(year);
            setData(res.data);
            setView('months');
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleMonthClick = async (month) => {
        setSelectedMonth(month);
        setLoading(true);
        try {
            const res = await getLogsDays(selectedYear, month);
            setData(res.data);
            setView('days');
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleDayClick = async (day) => {
        setSelectedDay(day);
        setLoading(true);
        try {
            const res = await getDayDetails(selectedYear, selectedMonth, day);
            setData(res.data);
            setView('details');
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return loadYears();

        setLoading(true);
        try {
            const res = await searchLogs(searchQuery);
            setData(res.data);
            setView('search');
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const resetView = () => {
        setSearchQuery('');
        setSelectedYear(null);
        setSelectedMonth(null);
        setSelectedDay(null);
        loadYears();
    };

    const renderBreadcrumbs = () => {
        if (view === 'search') return <Breadcrumb.Item active>Search Results</Breadcrumb.Item>;
        return (
            <Breadcrumb>
                <Breadcrumb.Item onClick={resetView}>Logs</Breadcrumb.Item>
                {selectedYear && (
                    <Breadcrumb.Item onClick={() => handleYearClick(selectedYear)} active={view === 'months'}>
                        {selectedYear}
                    </Breadcrumb.Item>
                )}
                {selectedMonth && (
                    <Breadcrumb.Item onClick={() => handleMonthClick(selectedMonth)} active={view === 'days'}>
                        {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })}
                    </Breadcrumb.Item>
                )}
                {selectedDay && <Breadcrumb.Item active>{selectedDay}</Breadcrumb.Item>}
            </Breadcrumb>
        );
    };

    const renderContent = () => {
        if (loading) return <Spinner animation="border" />;

        if (view === 'years') {
            return (
                <Row>
                    {data.map(year => (
                        <Col key={year} md={3} className="mb-3">
                            <Card className="text-center p-4 shadow-sm cursor-pointer" onClick={() => handleYearClick(year)} style={{ cursor: 'pointer' }}>
                                <h3>{year}</h3>
                            </Card>
                        </Col>
                    ))}
                    {data.length === 0 && <p>No logs available.</p>}
                </Row>
            );
        }

        if (view === 'months') {
            return (
                <Row>
                    {data.map(item => (
                        <Col key={item._id} md={3} className="mb-3">
                            <Card className="text-center p-4 shadow-sm cursor-pointer" onClick={() => handleMonthClick(item._id)} style={{ cursor: 'pointer' }}>
                                <h4>{new Date(selectedYear, item._id - 1).toLocaleString('default', { month: 'long' })}</h4>
                                <div className="text-muted small">{item.count} Transactions</div>
                                <div className="text-success small">PKR {item.revenue.toLocaleString()}</div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            );
        }

        if (view === 'days') {
            return (
                <Row>
                    {data.map(item => (
                        <Col key={item._id} md={2} className="mb-3">
                            <Card className="text-center p-3 shadow-sm cursor-pointer" onClick={() => handleDayClick(item._id)} style={{ cursor: 'pointer' }}>
                                <h5>Day {item._id}</h5>
                                <div className="text-muted small">{item.count} Txns</div>
                                <div className="text-success small">PKR {item.revenue.toLocaleString()}</div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            );
        }

        if (view === 'details' || view === 'search') {
            return (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Party</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(txn => (
                            <tr key={txn._id}>
                                <td>{new Date(txn.date).toLocaleString()}</td>
                                <td>
                                    <Badge bg={
                                        txn.type === 'sale' ? 'success' :
                                            txn.type === 'purchase' ? 'primary' :
                                                'warning'
                                    }>
                                        {txn.type}
                                    </Badge>
                                </td>
                                <td>{txn.partyName || '-'}</td>
                                <td>
                                    <ul className="list-unstyled mb-0">
                                        {txn.items.map((item, idx) => (
                                            <li key={idx}>
                                                {item.productName} ({item.quantity})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>PKR {txn.totalAmount.toLocaleString()}</td>
                                <td>{txn.notes}</td>
                            </tr>
                        ))}
                        {data.length === 0 && <tr><td colSpan="6" className="text-center">No transactions found</td></tr>}
                    </tbody>
                </Table>
            );
        }
    };

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Logs</h2>
                <Form className="d-flex" onSubmit={handleSearch}>
                    <Form.Control
                        type="search"
                        placeholder="Search logs..."
                        className="me-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="outline-primary" type="submit">Search</Button>
                </Form>
            </div>

            {renderBreadcrumbs()}
            <div className="mt-4">
                {renderContent()}
            </div>
        </Container>
    );
};

export default Logs;
