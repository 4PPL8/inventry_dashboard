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

        // Check stock
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
            loadProducts(); // Refresh stock
        } catch (err) {
            setMessage('Checkout failed. Please try again.');
        }
    };

    const printInvoice = () => {
        window.print();
    };

    return (
        <Container>
            <h2 className="mb-4">Checkout / Point of Sale</h2>
            {message && <Alert variant="warning" onClose={() => setMessage(null)} dismissible>{message}</Alert>}

            <Row>
                <Col md={5}>
                    <Card className="p-4 shadow-sm mb-4">
                        <h4>Add Item</h4>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Product</Form.Label>
                                <Form.Select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id} disabled={p.quantity <= 0}>
                                            {p.name} (Stock: {p.quantity}) - PKR {p.sellingPrice}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" onClick={addToCart} disabled={!selectedProduct}>Add to Cart</Button>
                        </Form>
                    </Card>

                    <Card className="p-4 shadow-sm">
                        <h4>Customer Details</h4>
                        <Form.Group className="mb-3">
                            <Form.Label>Name (Optional)</Form.Label>
                            <Form.Control type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                        </Form.Group>
                    </Card>
                </Col>

                <Col md={7}>
                    <Card className="p-4 shadow-sm">
                        <h4>Cart</h4>
                        <Table striped bordered hover>
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
                                        <td>{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.total}</td>
                                        <td><Button variant="danger" size="sm" onClick={() => removeFromCart(index)}>X</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <h5>Subtotal: PKR {cart.reduce((acc, item) => acc + item.total, 0)}</h5>
                        </div>
                        <Form.Group className="mb-3 mt-2">
                            <Form.Label>Discount</Form.Label>
                            <Form.Control type="number" value={discount} onChange={e => setDiscount(e.target.value)} />
                        </Form.Group>
                        <h3 className="text-end text-success">Total: PKR {calculateTotal()}</h3>

                        <div className="d-grid gap-2 mt-4">
                            <Button variant="success" size="lg" onClick={handleCheckout} disabled={cart.length === 0}>Complete Sale</Button>
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
                    <Button variant="secondary" onClick={() => setShowInvoice(false)}>Close</Button>
                    <Button variant="primary" onClick={printInvoice}>Print Invoice</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Checkout;
