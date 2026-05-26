import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ message, visible }) {
  return (
    <div className={`toast${visible ? ' toast--visible' : ''}`}>
      <CheckCircle />
      {message}
    </div>
  );
}
