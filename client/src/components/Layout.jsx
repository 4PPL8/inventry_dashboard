import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand as={Link} to="/">Inventory System</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Dashboard</Nav.Link>
                            <Nav.Link as={Link} to="/logs" active={location.pathname === '/logs'}>Logs</Nav.Link>
                            <Nav.Link as={Link} to="/add-inventory" active={location.pathname === '/add-inventory'}>Inventory</Nav.Link>
                            <Nav.Link as={Link} to="/checkout" active={location.pathname === '/checkout'}>Checkout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                {children}
            </Container>
        </>
    );
};

export default Layout;
