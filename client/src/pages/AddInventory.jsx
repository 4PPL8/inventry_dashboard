import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { getProducts, createTransaction, addProduct, updateProduct } from '../services/api';
import { Plus, ShoppingBag, RotateCcw, CornerUpLeft } from 'lucide-react';

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
        { key: 'add', label: 'Add New Stock', icon: Plus, gradient: 'var(--gradient-info)' },
        { key: 'purchase', label: 'Purchase', icon: ShoppingBag, gradient: 'var(--gradient-success)' },
        { key: 'return_supplier', label: 'Return to Supplier', icon: RotateCcw, gradient: 'var(--gradient-warning)' },
        { key: 'return_customer', label: 'Return from Customer', icon: CornerUpLeft, gradient: 'var(--gradient-danger)' }
    ];

    return (
        <Container fluid className="px-4">
            <div className="mb-5">
                <h2 style={{
                    marginBottom: '0.5rem',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.5px'
                }}>Inventory Management</h2>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    marginBottom: '2rem'
                }}>Manage your stock, purchases, and returns</p>
            </div>

            {message && (
                <Alert
                    variant="success"
                    onClose={() => setMessage(null)}
                    dismissible
                    style={{
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: 'var(--gradient-success)',
                        color: '#ffffff',
                        fontWeight: '500',
                        marginBottom: '1.5rem'
                    }}
                >
                    {message}
                </Alert>
            )}
            {error && (
                <Alert
                    variant="danger"
                    onClose={() => setError(null)}
                    dismissible
                    style={{
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: 'var(--gradient-danger)',
                        color: '#ffffff',
                        fontWeight: '500',
                        marginBottom: '1.5rem'
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* Modern Tab Buttons */}
            <div style={{
                marginBottom: '2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
            }}>
                {tabs.map(tab => {
                    const IconComponent = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: '1rem 1.5rem',
                                background: activeTab === tab.key ? tab.gradient : 'var(--bg-card)',
                                color: activeTab === tab.key ? '#ffffff' : 'var(--text-primary)',
                                border: activeTab === tab.key ? 'none' : 'var(--glass-border)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontWeight: activeTab === tab.key ? '600' : '500',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s ease',
                                boxShadow: activeTab === tab.key ? '0 4px 15px rgba(0, 0, 0, 0.15)' : 'var(--card-shadow)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== tab.key) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== tab.key) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                                }
                            }}
                        >
                            <IconComponent size={20} strokeWidth={2} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
                {activeTab === 'add' && (
                    <Card style={{
                        backgroundColor: 'var(--bg-card)',
                        border: 'var(--glass-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '2rem',
                        boxShadow: 'var(--card-shadow)'
                    }}>
                        <h4 style={{
                            marginBottom: '1.5rem',
                            color: 'var(--text-primary)',
                            fontSize: '1.5rem',
                            fontWeight: '600'
                        }}>Add New Product</h4>
                        <Form onSubmit={handleAddProduct}>
                            <Row className="g-3">
                                <Col xs={12} md={6}>
                                    <Form.Group>
                                        <Form.Label style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>Product Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                            required
                                            placeholder="Enter product name"
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group>
                                        <Form.Label style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>Category (ID)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={newProduct.category}
                                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                            required
                                            placeholder="Enter category ID"
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="g-3 mt-2">
                                <Col xs={12} sm={4}>
                                    <Form.Group>
                                        <Form.Label style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>Cost Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={newProduct.costPrice}
                                            onChange={e => setNewProduct({ ...newProduct, costPrice: e.target.value })}
                                            required
                                            placeholder="0.00"
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form.Group>
                                        <Form.Label style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>Selling Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={newProduct.sellingPrice}
                                            onChange={e => setNewProduct({ ...newProduct, sellingPrice: e.target.value })}
                                            required
                                            placeholder="0.00"
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form.Group>
                                        <Form.Label style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>Initial Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={newProduct.quantity}
                                            onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
                                            required
                                            placeholder="0"
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    style={{
                                        padding: '0.75rem 2rem',
                                        fontWeight: '500',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Add Product
                                </Button>
                            </div>
                        </Form>
                    </Card>
                )}

                {activeTab === 'purchase' && (
                    <Card style={{
                        backgroundColor: 'var(--bg-card)',
                        border: 'var(--glass-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '2rem',
                        boxShadow: 'var(--card-shadow)'
                    }}>
                        <h4 style={{
                            marginBottom: '1.5rem',
                            color: 'var(--text-primary)',
                            fontSize: '1.5rem',
                            fontWeight: '600'
                        }}>Restock Existing Product</h4>
                        <Form onSubmit={(e) => handleTransaction(e, 'purchase')}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem'
                                }}>Product</Form.Label>
                                <Form.Select
                                    value={transaction.product}
                                    onChange={e => setTransaction({ ...transaction, product: e.target.value })}
                                    required
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                        padding: '0.75rem 1rem',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Row className="g-3">
                                <Col xs={12} sm={4}>
                                    <Form.Group>
                                        <Form.Label style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={transaction.quantity}
                                            onChange={e => setTransaction({ ...transaction, quantity: e.target.value })}
                                            required
                                            placeholder="0"
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form.Group>
                                        <Form.Label style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>Cost Price (Per Unit)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={transaction.price}
                                            onChange={e => setTransaction({ ...transaction, price: e.target.value })}
                                            required
                                            placeholder="0.00"
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Form.Group>
                                        <Form.Label style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>Supplier Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={transaction.partyName}
                                            onChange={e => setTransaction({ ...transaction, partyName: e.target.value })}
                                            placeholder="Enter supplier name"
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    style={{
                                        padding: '0.75rem 2rem',
                                        fontWeight: '500',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Record Purchase
                                </Button>
                            </div>
                        </Form>
                    </Card>
                )}

                {activeTab === 'return_supplier' && (
                    <Card style={{
                        backgroundColor: 'var(--bg-card)',
                        border: 'var(--glass-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '2rem',
                        boxShadow: 'var(--card-shadow)'
                    }}>
                        <h4 style={{
                            marginBottom: '1.5rem',
                            color: 'var(--text-primary)',
                            fontSize: '1.5rem',
                            fontWeight: '600'
                        }}>Return to Supplier</h4>
                        <Form onSubmit={(e) => handleTransaction(e, 'return_supplier')}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem'
                                }}>Product</Form.Label>
                                <Form.Select
                                    value={transaction.product}
                                    onChange={e => setTransaction({ ...transaction, product: e.target.value })}
                                    required
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                        padding: '0.75rem 1rem',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Row className="g-3">
                                <Col xs={12} md={6}>
                                    <Form.Group>
                                        <Form.Label style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={transaction.quantity}
                                            onChange={e => setTransaction({ ...transaction, quantity: e.target.value })}
                                            required
                                            placeholder="0"
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group>
                                        <Form.Label style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>Supplier Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={transaction.partyName}
                                            onChange={e => setTransaction({ ...transaction, partyName: e.target.value })}
                                            placeholder="Enter supplier name"
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mt-3">
                                <Form.Label style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem'
                                }}>Reason / Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={transaction.notes}
                                    onChange={e => setTransaction({ ...transaction, notes: e.target.value })}
                                    placeholder="Enter reason for return..."
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                        padding: '0.75rem 1rem',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </Form.Group>
                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    style={{
                                        padding: '0.75rem 2rem',
                                        fontWeight: '500',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Record Return
                                </Button>
                            </div>
                        </Form>
                    </Card>
                )}

                {activeTab === 'return_customer' && (
                    <Card style={{
                        backgroundColor: 'var(--bg-card)',
                        border: 'var(--glass-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '2rem',
                        boxShadow: 'var(--card-shadow)'
                    }}>
                        <h4 style={{
                            marginBottom: '1.5rem',
                            color: 'var(--text-primary)',
                            fontSize: '1.5rem',
                            fontWeight: '600'
                        }}>Return from Customer</h4>
                        <Form onSubmit={(e) => handleTransaction(e, 'return_customer')}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem'
                                }}>Product</Form.Label>
                                <Form.Select
                                    value={transaction.product}
                                    onChange={e => setTransaction({ ...transaction, product: e.target.value })}
                                    required
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                        padding: '0.75rem 1rem',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Row className="g-3">
                                <Col xs={12} md={6}>
                                    <Form.Group>
                                        <Form.Label style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={transaction.quantity}
                                            onChange={e => setTransaction({ ...transaction, quantity: e.target.value })}
                                            required
                                            placeholder="0"
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group>
                                        <Form.Label style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            marginBottom: '0.5rem'
                                        }}>Customer Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={transaction.partyName}
                                            onChange={e => setTransaction({ ...transaction, partyName: e.target.value })}
                                            placeholder="Enter customer name"
                                            style={{
                                                backgroundColor: 'var(--bg-dark)',
                                                border: 'var(--glass-border)',
                                                color: 'var(--text-primary)',
                                                padding: '0.75rem 1rem',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mt-3">
                                <Form.Label style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem'
                                }}>Reason / Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={transaction.notes}
                                    onChange={e => setTransaction({ ...transaction, notes: e.target.value })}
                                    placeholder="Enter reason for return..."
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                        padding: '0.75rem 1rem',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </Form.Group>
                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    style={{
                                        padding: '0.75rem 2rem',
                                        fontWeight: '500',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Record Return
                                </Button>
                            </div>
                        </Form>
                    </Card>
                )}
            </div>
        </Container>
    );
};

export default AddInventory;
