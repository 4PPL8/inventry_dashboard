import React from 'react';
import { Nav, Button, Form, InputGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: 'dashboard' },
        { path: '/logs', label: 'Logs', icon: 'description' },
        { path: '/add-inventory', label: 'Inventory', icon: 'inventory_2' },
        { path: '/checkout', label: 'Checkout', icon: 'shopping_cart' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
            {/* Sidebar */}
            <div style={{
                width: 'var(--sidebar-width)',
                backgroundColor: 'var(--bg-sidebar)',
                borderRight: 'var(--glass-border)',
                position: 'fixed',
                height: '100vh',
                padding: '3rem 1.5rem',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div className="mb-5 px-2">
                    <h4 className="fw-bold mb-0" style={{ letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>INVENTORY</h4>
                </div>

                <div className="mb-4">
                    <small className="text-uppercase fw-bold text-muted mb-3 d-block px-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Main Menu</small>
                    <Nav className="flex-column gap-1">
                        {navItems.map((item) => (
                            <Nav.Link
                                key={item.path}
                                as={Link}
                                to={item.path}
                                className="d-flex align-items-center gap-3 px-2 py-2"
                                style={{
                                    color: location.pathname === item.path ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    fontWeight: location.pathname === item.path ? 600 : 400,
                                    transition: 'color 0.2s ease'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem', fontWeight: 400 }}>
                                    {item.icon === 'dashboard' ? '▣' :
                                        item.icon === 'description' ? '☰' :
                                            item.icon === 'inventory_2' ? '▢' : '◎'}
                                </span>
                                <span>{item.label}</span>
                            </Nav.Link>
                        ))}
                    </Nav>
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                marginLeft: 'var(--sidebar-width)',
                flex: 1,
                backgroundColor: 'var(--bg-dark)',
                minHeight: '100vh',
                color: 'var(--text-primary)'
            }}>
                {/* Header */}
                <header style={{
                    height: 'var(--header-height)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 3rem',
                    backgroundColor: 'var(--bg-dark)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 900
                }}>
                    <div className="d-flex align-items-center gap-4">
                        <InputGroup style={{ width: '300px' }}>
                            <InputGroup.Text style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', borderRight: 'none', color: 'var(--text-secondary)' }}>
                                ⌕
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Search..."
                                style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid var(--border-color)',
                                    borderLeft: 'none',
                                    color: 'var(--text-primary)',
                                    boxShadow: 'none'
                                }}
                            />
                        </InputGroup>

                        <Button
                            variant="outline-secondary"
                            onClick={toggleTheme}
                            className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)',
                                background: 'transparent'
                            }}
                        >
                            {theme === 'dark' ? '○' : '●'}
                        </Button>

                        <div className="rounded-circle" style={{ width: '40px', height: '40px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--text-secondary)' }}></div>
                        </div>
                    </div>
                </header>

                <main className="px-5 py-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
