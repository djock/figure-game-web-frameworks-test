import React from 'react';
import Square from './Square';
import styled from 'styled-components';

const GridContainer = styled.div`
  display: flex;
  flex-direction: column; /* Stack rows vertically */
  align-items: center; /* Center the grid items */
`;

const RowContainer = styled.div`
  display: flex; /* Arrange squares in a row */
`;

function Grid({ grid, onSquareClick }) {
    return (
        <GridContainer>
            {grid.map((row, rowIndex) => (
                <RowContainer key={rowIndex}>
                    {row.map((color, colIndex) => (
                        <Square
                            key={`${rowIndex}-${colIndex}`}
                            color={color}
                            onClick={() => onSquareClick(rowIndex, colIndex)}
                        />
                    ))}
                </RowContainer>
            ))}
        </GridContainer>
    );
}

export default Grid;