import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal } from 'react-bootstrap';
import { getProducts, createTransaction } from '../services/api';

const Checkout = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [message, setMessage] = useState(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [lastTransaction, setLastTransaction] = useState(null);

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

    const addToCart = () => {
        if (!selectedProduct) return;
        const product = products.find(p => p._id === selectedProduct);

        if (product.quantity < quantity) {
            setMessage(`Insufficient stock! Only ${product.quantity} available.`);
            return;
        }

        const item = {
            product: product._id,
            name: product.name,
            price: product.sellingPrice,
            quantity: Number(quantity),
            total: product.sellingPrice * Number(quantity)
        };

        setCart([...cart, item]);
        setSelectedProduct('');
        setQuantity(1);
        setMessage(null);
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const calculateTotal = () => {
        const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
        return subtotal - discount;
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        try {
            const payload = {
                type: 'sale',
                items: cart.map(item => ({
                    product: item.product,
                    quantity: item.quantity,
                    price: item.price
                })),
                partyName: customerName,
                discount: Number(discount),
                totalAmount: calculateTotal()
            };

            const res = await createTransaction(payload);
            setLastTransaction(res.data);
            setShowInvoice(true);
            setCart([]);
            setCustomerName('');
            setDiscount(0);
            loadProducts();
        } catch (err) {
            setMessage('Checkout failed. Please try again.');
        }
    };

    const printInvoice = () => {
        window.print();
    };

    return (
        <Container className="page-transition-enter">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--text-primary)', fontWeight: '600', margin: 0 }}>Checkout / Point of Sale</h2>

                {/* Running Total Display */}
                <div style={{
                    background: 'var(--gradient-info)',
                    padding: '1rem 2rem',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '200px',
                    position: 'relative'
                }}>
                    {cart.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: 'var(--danger)',
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}>
                            {cart.length}
                        </div>
                    )}
                    <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                        Running Total
                    </div>
                    <div style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
                        PKR {calculateTotal().toLocaleString()}
                    </div>
                </div>
            </div>

            {message && <Alert variant="warning" onClose={() => setMessage(null)} dismissible>{message}</Alert>}

            <Row className="g-3">
                <Col md={5} className="d-flex flex-column">
                    <Card className="mb-3" style={{
                        backgroundColor: 'var(--bg-card)',
                        border: 'var(--glass-border)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        flex: '0 0 auto'
                    }}>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: '600' }}>Add Item</h4>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Product</Form.Label>
                                <Form.Select
                                    value={selectedProduct}
                                    onChange={e => setSelectedProduct(e.target.value)}
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                        padding: '0.75rem'
                                    }}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id} disabled={p.quantity <= 0}>
                                            {p.name} (Stock: {p.quantity}) - PKR {p.sellingPrice}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={e => setQuantity(e.target.value)}
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>
                            <Button
                                onClick={addToCart}
                                disabled={!selectedProduct}
                                className="w-100"
                                style={{
                                    backgroundColor: '#000000',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontWeight: 600,
                                    padding: '0.75rem',
                                    borderRadius: '6px'
                                }}
                            >
                                Add to Cart
                            </Button>
                        </Form>
                    </Card>

                    <Card style={{
                        backgroundColor: 'var(--bg-card)',
                        border: 'var(--glass-border)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        flex: '1 1 auto'
                    }}>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: '600' }}>Customer Details</h4>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Name (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                value={customerName}
                                onChange={e => setCustomerName(e.target.value)}
                                placeholder="Enter customer name"
                                style={{
                                    backgroundColor: 'var(--bg-dark)',
                                    border: 'var(--glass-border)',
                                    color: 'var(--text-primary)',
                                    padding: '0.75rem'
                                }}
                            />
                        </Form.Group>
                    </Card>
                </Col>

                <Col md={7} className="d-flex">
                    <Card className="w-100" style={{
                        backgroundColor: 'var(--bg-card)',
                        border: 'var(--glass-border)',
                        borderRadius: '12px',
                        padding: '1.5rem'
                    }}>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: '600' }}>Cart</h4>
                        <Table striped bordered hover style={{ marginBottom: '1.5rem' }}>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>PKR {item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>PKR {item.total}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                onClick={() => removeFromCart(index)}
                                                style={{
                                                    backgroundColor: '#000000',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    padding: '0.25rem 0.5rem'
                                                }}
                                            >
                                                ×
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {cart.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>
                                            No items in cart
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        <div style={{
                            borderTop: '1px solid var(--border-color)',
                            paddingTop: '1rem',
                            marginTop: '1rem'
                        }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 style={{ color: 'var(--text-primary)', margin: 0 }}>Subtotal:</h5>
                                <h5 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '600' }}>PKR {cart.reduce((acc, item) => acc + item.total, 0)}</h5>
                            </div>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Discount</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={discount}
                                    onChange={e => setDiscount(e.target.value)}
                                    placeholder="0"
                                    style={{
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)',
                                        padding: '0.75rem'
                                    }}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-between align-items-center mb-4" style={{
                                borderTop: '2px solid var(--border-color)',
                                paddingTop: '1rem'
                            }}>
                                <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '700' }}>Total:</h4>
                                <h4 style={{ color: 'var(--text-primary)', margin: 0, fontWeight: '700' }}>PKR {calculateTotal()}</h4>
                            </div>

                            <div className="d-grid gap-2">
                                <Button
                                    onClick={handleCheckout}
                                    disabled={cart.length === 0}
                                    style={{
                                        backgroundColor: '#000000',
                                        color: '#ffffff',
                                        border: 'none',
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        padding: '1rem',
                                        borderRadius: '6px'
                                    }}
                                >
                                    Complete Sale
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Invoice Modal */}
            <Modal show={showInvoice} onHide={() => setShowInvoice(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Invoice Generated</Modal.Title>
                </Modal.Header>
                <Modal.Body className="invoice-print">
                    {lastTransaction && (
                        <div className="p-3">
                            <div className="text-center mb-4">
                                <h3>Women's Clothing Shop</h3>
                                <p>Invoice #{lastTransaction._id.slice(-6).toUpperCase()}</p>
                                <p>{new Date(lastTransaction.date).toLocaleString()}</p>
                            </div>
                            <hr />
                            <p><strong>Customer:</strong> {lastTransaction.partyName || 'Walk-in'}</p>
                            <Table borderless>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lastTransaction.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.productName}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price}</td>
                                            <td>{item.quantity * item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <hr />
                            <div className="text-end">
                                <p>Discount: PKR {lastTransaction.discount}</p>
                                <h4>Total: PKR {lastTransaction.totalAmount}</h4>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setShowInvoice(false)}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#000',
                            border: '1px solid #000'
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={printInvoice}
                        style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none'
                        }}
                    >
                        Print Invoice
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Checkout;
