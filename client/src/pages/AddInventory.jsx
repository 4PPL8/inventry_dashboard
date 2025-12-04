import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { getProducts, createTransaction, addProduct, updateProduct } from '../services/api';

const AddInventory = () => {
    const [activeTab, setActiveTab] = useState('add');
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Form States
    const [newProduct, setNewProduct] = useState({
        name: '', category: '', costPrice: '', sellingPrice: '', quantity: '', supplier: '', notes: ''
    });

    const [transaction, setTransaction] = useState({
        product: '', quantity: '', price: '', notes: '', partyName: ''
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await getProducts();
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await addProduct(newProduct);
            setMessage('Product added successfully');
            setNewProduct({ name: '', category: '', costPrice: '', sellingPrice: '', quantity: '', supplier: '', notes: '' });
            loadProducts();
        } catch (err) {
            setError('Failed to add product');
        }
    };

    const handleTransaction = async (e, type) => {
        e.preventDefault();
        try {
            const payload = {
                type,
                items: [{
                    product: transaction.product,
                    quantity: Number(transaction.quantity),
                    price: Number(transaction.price)
                }],
                partyName: transaction.partyName,
                notes: transaction.notes,
                totalAmount: Number(transaction.quantity) * Number(transaction.price)
            };

            await createTransaction(payload);
            setMessage('Transaction recorded successfully');
            setTransaction({ product: '', quantity: '', price: '', notes: '', partyName: '' });
            loadProducts();
        } catch (err) {
            setError('Failed to record transaction');
        }
    };

    const tabs = [
        { key: 'add', label: 'Add New Stock' },
        { key: 'purchase', label: 'Purchase' },
        { key: 'return_supplier', label: 'Return to Supplier' },
        { key: 'return_customer', label: 'Return from Customer' }
    ];

    return (
        <Container>
            <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>Inventory Management</h2>

            {message && <Alert variant="success" onClose={() => setMessage(null)} dismissible>{message}</Alert>}
            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

            {/* Custom Tab Buttons */}
            <div style={{
                marginBottom: '2rem',
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.5rem'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: activeTab === tab.key ? 'var(--text-primary)' : 'transparent',
                            color: activeTab === tab.key ? 'var(--bg-dark)' : 'var(--text-primary)',
                            border: activeTab === tab.key ? 'none' : '1px solid var(--border-color)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: activeTab === tab.key ? '600' : '400',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            flex: '1 1 auto',
                            minWidth: 'fit-content'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== tab.key) {
                                e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== tab.key) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'add' && (
                    <Card style={{
                        backgroundColor: 'var(--bg-card)',
                        border: 'var(--glass-border)',
                        borderRadius: '12px',
                        padding: '2rem'
                    }}>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Add New Product</h4>
                        <Form onSubmit={handleAddProduct}>
                            <Row>
                                <Col xs={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                            required
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Category (ID)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={newProduct.category}
                                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                            required
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} sm={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Cost Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={newProduct.costPrice}
                                            onChange={e => setNewProduct({ ...newProduct, costPrice: e.target.value })}
                                            required
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Selling Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={newProduct.sellingPrice}
                                            onChange={e => setNewProduct({ ...newProduct, sellingPrice: e.target.value })}
                                            required
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Initial Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={newProduct.quantity}
                                            onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
                                            required
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button
                                type="submit"
                                style={{
                                    backgroundColor: 'var(--text-primary)',
                                    color: 'var(--bg-dark)',
                                    border: 'none',
                                    padding: '0.75rem 2rem',
                                    fontWeight: '500'
                                }}
                            >
                                Add Product
                            </Button>
                        </Form>
                    </Card>
                )}

                {activeTab === 'purchase' && (
                    <Card style={{
                        backgroundColor: 'var(--bg-card)',
                        border: 'var(--glass-border)',
                        borderRadius: '12px',
                        padding: '2rem'
                    }}>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Restock Existing Product</h4>
                        <Form onSubmit={(e) => handleTransaction(e, 'purchase')}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Product</Form.Label>
                                <Form.Select
                                    value={transaction.product}
                                    onChange={e => setTransaction({ ...transaction, product: e.target.value })}
                                    required
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Row>
                                <Col xs={12} sm={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={transaction.quantity}
                                            onChange={e => setTransaction({ ...transaction, quantity: e.target.value })}
                                            required
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Cost Price (Per Unit)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={transaction.price}
                                            onChange={e => setTransaction({ ...transaction, price: e.target.value })}
                                            required
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Supplier Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={transaction.partyName}
                                            onChange={e => setTransaction({ ...transaction, partyName: e.target.value })}
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button
                                type="submit"
                                style={{
                                    backgroundColor: 'var(--text-primary)',
                                    color: 'var(--bg-dark)',
                                    border: 'none',
                                    padding: '0.75rem 2rem',
                                    fontWeight: '500'
                                }}
                            >
                                Record Purchase
                            </Button>
                        </Form>
                    </Card>
                )}

                {activeTab === 'return_supplier' && (
                    <Card style={{
                        backgroundColor: 'var(--bg-card)',
                        border: 'var(--glass-border)',
                        borderRadius: '12px',
                        padding: '2rem'
                    }}>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Return to Supplier</h4>
                        <Form onSubmit={(e) => handleTransaction(e, 'return_supplier')}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Product</Form.Label>
                                <Form.Select
                                    value={transaction.product}
                                    onChange={e => setTransaction({ ...transaction, product: e.target.value })}
                                    required
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Row>
                                <Col xs={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={transaction.quantity}
                                            onChange={e => setTransaction({ ...transaction, quantity: e.target.value })}
                                            required
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Supplier Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={transaction.partyName}
                                            onChange={e => setTransaction({ ...transaction, partyName: e.target.value })}
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Reason / Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={transaction.notes}
                                    onChange={e => setTransaction({ ...transaction, notes: e.target.value })}
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                style={{
                                    backgroundColor: 'var(--text-primary)',
                                    color: 'var(--bg-dark)',
                                    border: 'none',
                                    padding: '0.75rem 2rem',
                                    fontWeight: '500'
                                }}
                            >
                                Record Return
                            </Button>
                        </Form>
                    </Card>
                )}

                {activeTab === 'return_customer' && (
                    <Card style={{
                        backgroundColor: 'var(--bg-card)',
                        border: 'var(--glass-border)',
                        borderRadius: '12px',
                        padding: '2rem'
                    }}>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Return from Customer</h4>
                        <Form onSubmit={(e) => handleTransaction(e, 'return_customer')}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Product</Form.Label>
                                <Form.Select
                                    value={transaction.product}
                                    onChange={e => setTransaction({ ...transaction, product: e.target.value })}
                                    required
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Row>
                                <Col xs={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={transaction.quantity}
                                            onChange={e => setTransaction({ ...transaction, quantity: e.target.value })}
                                            required
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Customer Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={transaction.partyName}
                                            onChange={e => setTransaction({ ...transaction, partyName: e.target.value })}
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Reason / Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={transaction.notes}
                                    onChange={e => setTransaction({ ...transaction, notes: e.target.value })}
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                style={{
                                    backgroundColor: 'var(--text-primary)',
                                    color: 'var(--bg-dark)',
                                    border: 'none',
                                    padding: '0.75rem 2rem',
                                    fontWeight: '500'
                                }}
                            >
                                Record Return
                            </Button>
                        </Form>
                    </Card>
                )}
            </div>
        </Container>
    );
};

export default AddInventory;
