import React from 'react';

const StatsCard = ({ title, value }) => {
    return (
        <div>
            <h6 className="text-secondary text-uppercase mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px', fontWeight: 600 }}>{title}</h6>
            <h3 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '2rem' }}>PKR {value}</h3>
        </div>
    );
};

export default StatsCard;
