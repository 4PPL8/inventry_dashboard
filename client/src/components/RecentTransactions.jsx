import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';
import { ArrowUpRight, ArrowDownRight, RotateCcw, CornerUpLeft } from 'lucide-react';

const RecentTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const res = await getTransactions({ limit: 5 });
            setTransactions(res.data.slice(0, 5));
        } catch (err) {
            console.error('Error loading transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'sale':
                return { Icon: ArrowUpRight, color: 'var(--success)' };
            case 'purchase':
                return { Icon: ArrowDownRight, color: 'var(--info)' };
            case 'return_supplier':
                return { Icon: RotateCcw, color: 'var(--warning)' };
            case 'return_customer':
                return { Icon: CornerUpLeft, color: 'var(--danger)' };
            default:
                return { Icon: ArrowUpRight, color: 'var(--text-secondary)' };
        }
    };

    const getTransactionLabel = (type) => {
        const labels = {
            sale: 'Sale',
            purchase: 'Purchase',
            return_supplier: 'Return to Supplier',
            return_customer: 'Return from Customer'
        };
        return labels[type] || type;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
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
                }}>Recent Transactions</h5>
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    Loading...
                </div>
            </div>
        );
    }

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
            }}>Recent Transactions</h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {transactions.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem'
                    }}>
                        No transactions yet
                    </div>
                ) : (
                    <>
                        {transactions.slice(0, showAll ? 5 : 2).map((transaction) => {
                            const { Icon, color } = getTransactionIcon(transaction.type);
                            return (
                                <div
                                    key={transaction._id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        backgroundColor: 'var(--bg-dark)',
                                        border: 'var(--glass-border)',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-dark)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        backgroundColor: `${color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Icon size={20} color={color} strokeWidth={2} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            color: 'var(--text-primary)',
                                            fontWeight: '500',
                                            fontSize: '0.9rem',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {getTransactionLabel(transaction.type)}
                                        </div>
                                        <div style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.75rem'
                                        }}>
                                            {transaction.partyName || 'Walk-in'} • {formatDate(transaction.date)}
                                        </div>
                                    </div>
                                    <div style={{
                                        color: transaction.type === 'sale' ? 'var(--success)' : 'var(--text-primary)',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        flexShrink: 0
                                    }}>
                                        PKR {transaction.totalAmount?.toLocaleString() || 0}
                                    </div>
                                </div>
                            );
                        })}

                        {transactions.length > 2 && (
                            <button
                                onClick={() => setShowAll(!showAll)}
                                style={{
                                    marginTop: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'transparent',
                                    border: 'var(--glass-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--accent-primary)',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    alignSelf: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                }}
                            >
                                {showAll ? 'Show Less' : `Show More (${transactions.length - 2} more)`}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;
