import React from 'react';
import styled from 'styled-components';

const SquareButton = styled.button`
  width: 30px;  // Adjust size as needed
  height: 30px;
  background-color: ${props => props.color};
  border: 1px solid #ccc;
  cursor: pointer;
  margin: 1px; /* Add some spacing between squares */

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background-color: #eee;
    border-color: #ddd;
    cursor: not-allowed;
  }
`;

function Square({ color, onClick }) {
    return <SquareButton color={color} onClick={onClick} disabled={!color} />;
}

export default Square;