import React from 'react';

const StatsCard = ({ title, value, gradient }) => {
    return (
        <div style={{
            animation: 'fadeIn 0.6s ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.5rem',
            background: gradient || 'var(--gradient-info)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease'
        }}>
            <div>
                <h6
                    className="text-uppercase mb-2"
                    style={{
                        fontSize: '0.7rem',
                        letterSpacing: '1.5px',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.85)',
                        transition: 'color 0.3s ease'
                    }}
                >
                    {title}
                </h6>
            </div>

            <div>
                <h3
                    className="fw-bold mb-0"
                    style={{
                        color: '#ffffff',
                        fontSize: '2rem',
                        letterSpacing: '-0.5px',
                        transition: 'color 0.3s ease',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    PKR {value?.toLocaleString() || '0'}
                </h3>
            </div>
        </div>
    );
};

export default StatsCard;
