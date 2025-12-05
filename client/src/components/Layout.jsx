import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard,
    FileText,
    Package,
    ShoppingCart,
    Sun,
    Moon
} from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/logs', label: 'Logs', icon: FileText },
        { path: '/add-inventory', label: 'Inventory', icon: Package },
        { path: '/checkout', label: 'Checkout', icon: ShoppingCart },
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
                flexDirection: 'column',
                transition: 'all 0.3s ease'
            }}>
                <div className="mb-5 px-2">
                    <h4 className="fw-bold mb-0" style={{
                        letterSpacing: '-0.5px',
                        color: 'var(--text-primary)',
                        transition: 'color 0.3s ease'
                    }}>INVENTORY</h4>
                </div>

                <div className="mb-4">
                    <small className="text-uppercase fw-bold mb-3 d-block px-2" style={{
                        fontSize: '0.75rem',
                        letterSpacing: '1px',
                        color: 'var(--text-secondary)',
                        transition: 'color 0.3s ease'
                    }}>Main Menu</small>
                    <Nav className="flex-column gap-1">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Nav.Link
                                    key={item.path}
                                    as={Link}
                                    to={item.path}
                                    className="d-flex align-items-center gap-3 px-3 py-3"
                                    style={{
                                        color: location.pathname === item.path ? '#ffffff' : 'var(--text-secondary)',
                                        fontWeight: location.pathname === item.path ? 600 : 400,
                                        background: location.pathname === item.path ? 'var(--gradient-info)' : 'transparent',
                                        borderRadius: 'var(--radius-sm)',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (location.pathname !== item.path) {
                                            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (location.pathname !== item.path) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }
                                    }}
                                >
                                    <IconComponent
                                        size={20}
                                        strokeWidth={2}
                                        style={{
                                            transition: 'transform 0.3s ease',
                                            flexShrink: 0
                                        }}
                                    />
                                    <span>{item.label}</span>
                                </Nav.Link>
                            );
                        })}
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
                    backdropFilter: 'blur(10px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 900,
                    borderBottom: 'var(--glass-border)',
                    transition: 'all 0.3s ease'
                }}>
                    <Button
                        variant="outline-secondary"
                        onClick={toggleTheme}
                        className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)',
                            background: 'transparent',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'rotate(180deg) scale(1.1)';
                            e.currentTarget.style.borderColor = 'var(--accent-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </Button>
                </header>

                {/* Main Content Area */}
                <main className="px-5 py-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
