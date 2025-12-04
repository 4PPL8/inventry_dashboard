import React from 'react';
import { Card } from 'react-bootstrap';

const StatsCard = ({ title, value, color = 'primary' }) => {
    return (
        <Card className={`mb-3 border-${color} shadow-sm`}>
            <Card.Body>
                <Card.Title className={`text-${color}`}>{title}</Card.Title>
                <Card.Text className="h2">
                    {typeof value === 'number' ? `PKR ${value.toLocaleString()}` : value}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default StatsCard;
