import React from 'react';
import styled, { css } from 'styled-components';

const SquareButton = styled.button`
  width: 68px;
  height: 68px;
  background-color: ${props => props.willDisappear ? props.color : 'transparent'};
  border: 6px solid ${props => props.color || 'transparent'};
  border-radius: 25px;
  cursor: pointer;
  margin: 6px;
  position: relative;
  box-shadow: ${props => props.bottomRow ? `0 0 10px ${props.color}` : 'none'}; /* Apply glow only for bottomRow */

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background-color: transparent;
    cursor: not-allowed;
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0);
  }

  ${props => props.color === '#01FFDD' && css`
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 15px;
      height: 15px;
      background-color: ${props => props.willDisappear ? '#06066A' : '#01FFDD'};
      transform: translate(-50%, -50%) rotate(45deg);
    }
  `}

  ${props => props.color === 'white' && css`
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 15px;
      height: 15px;
      background-color: ${props => props.willDisappear ? '#06066A' : 'white'};
      transform: translate(-50%, -50%);
    }
  `}

  ${props => props.color === '#FF66FF' && css`
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 15px solid ${props => props.willDisappear ? '#06066A' : '#FF66FF'};
      transform: translate(-50%, -50%);
    }
  `}

  ${props => props.color === '#FFEE33' && css`
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 15px;
      height: 15px;
      background-color: ${props => props.willDisappear ? '#06066A' : '#FFEE33'};
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  `}
`;

function Square({ color, onClick, bottomRow, willDisappear }) {
  return <SquareButton color={color} onClick={onClick} bottomRow={bottomRow} willDisappear={willDisappear} disabled={!color} />;
}

export default Square;