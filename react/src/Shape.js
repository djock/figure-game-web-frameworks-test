import React from 'react';
import styled from 'styled-components';

const ShapeContainer = styled.div`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
  border-radius: ${props => (props.type === 'circle' ? '50%' : '0')};
  border: ${props => (props.type === 'triangle' ? '1px solid black' : 'none')};
  clip-path: ${props => (props.type === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none')};
  cursor: pointer;
  margin: 10px;

  &:hover {
    opacity: 0.8;
  }
`;

function Shape({ type, size, color, onClick }) {
  return (
    <ShapeContainer type={type} size={size} color={color} onClick={onClick}>
    </ShapeContainer>
  );
}

export default Shape;