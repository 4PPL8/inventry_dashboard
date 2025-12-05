import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingCart, FileText, Package2 } from 'lucide-react';

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            title: 'Add Product',
            description: 'Add new inventory',
            icon: Plus,
            gradient: 'var(--gradient-info)',
            path: '/add-inventory'
        },
        {
            title: 'Record Sale',
            description: 'Process checkout',
            icon: ShoppingCart,
            gradient: 'var(--gradient-success)',
            path: '/checkout'
        },
        {
            title: 'View Logs',
            description: 'Transaction history',
            icon: FileText,
            gradient: 'var(--gradient-warning)',
            path: '/logs'
        },
        {
            title: 'Manage Stock',
            description: 'Update inventory',
            icon: Package2,
            gradient: 'var(--gradient-danger)',
            path: '/add-inventory'
        }
    ];

    return (
        <div style={{
            backgroundColor: 'var(--bg-card)',
            border: 'var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            boxShadow: 'var(--card-shadow)'
        }}>
            <h5 style={{
                marginBottom: '1.5rem',
                color: 'var(--text-primary)',
                fontWeight: '600',
                fontSize: '1.1rem'
            }}>Quick Actions</h5>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem'
            }}>
                {actions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                        <button
                            key={index}
                            onClick={() => navigate(action.path)}
                            style={{
                                background: 'var(--bg-dark)',
                                border: 'var(--glass-border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '1.25rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.75rem',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: action.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }}>
                                <IconComponent size={24} color="#ffffff" strokeWidth={2} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    color: 'var(--text-primary)',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    marginBottom: '0.25rem'
                                }}>{action.title}</div>
                                <div style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.75rem'
                                }}>{action.description}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActions;
