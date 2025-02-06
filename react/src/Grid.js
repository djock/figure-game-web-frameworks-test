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

function Grid({ grid, onSquareClick , connectedToBottom}) {
    return (
        <GridContainer>
            {grid.map((row, rowIndex) => (
                <RowContainer key={rowIndex}>
                    {row.map((cell, colIndex) => (
                        <Square
                            key={`${rowIndex}-${colIndex}`}
                            color={cell ? cell.color || cell : null}
                            onClick={() => onSquareClick(rowIndex, colIndex)}
                            willDisappear={cell ? cell.willDisappear : false}
                            bottomRow={rowIndex === grid.length - 1}
                            connectedToBottom={connectedToBottom[rowIndex]?.[colIndex]}
                        />
                    ))}
                </RowContainer>
            ))}
        </GridContainer>
    );
}

export default Grid;