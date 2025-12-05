import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const DateRangeSelector = ({ onDateRangeChange }) => {
    const [selectedRange, setSelectedRange] = useState('month');

    const ranges = [
        { key: 'today', label: 'Today', days: 0 },
        { key: 'week', label: 'Week', days: 7 },
        { key: 'month', label: 'Month', days: 30 },
        { key: 'year', label: 'Year', days: 365 }
    ];

    const handleRangeChange = (range) => {
        setSelectedRange(range.key);

        const endDate = new Date();
        const startDate = new Date();

        if (range.days === 0) {
            startDate.setHours(0, 0, 0, 0);
        } else {
            startDate.setDate(startDate.getDate() - range.days);
        }

        if (onDateRangeChange) {
            onDateRangeChange({ startDate, endDate, range: range.key });
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem',
            backgroundColor: 'var(--bg-card)',
            border: 'var(--glass-border)',
            borderRadius: 'var(--radius-sm)',
            width: 'fit-content'
        }}>
            <Calendar size={18} color="var(--text-secondary)" />
            {ranges.map((range) => (
                <button
                    key={range.key}
                    onClick={() => handleRangeChange(range)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: selectedRange === range.key ? 'var(--gradient-info)' : 'transparent',
                        color: selectedRange === range.key ? '#ffffff' : 'var(--text-secondary)',
                        fontWeight: selectedRange === range.key ? '600' : '500',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (selectedRange !== range.key) {
                            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (selectedRange !== range.key) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                    }}
                >
                    {range.label}
                </button>
            ))}
        </div>
    );
};

export default DateRangeSelector;
