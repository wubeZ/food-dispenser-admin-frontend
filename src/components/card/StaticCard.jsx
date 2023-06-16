import React from 'react';
import { Card } from 'react-bootstrap';
import './staticcard.css';

function StatisticCard({ title, value }) {
  return (
    <Card style={{ width: '18rem', margin: '0 1rem' }} className='card'>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{value}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default StatisticCard;