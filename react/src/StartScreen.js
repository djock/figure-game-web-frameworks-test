import React from 'react';
import styled from 'styled-components';

const StartScreenContainer = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const StartButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

function StartScreen({ onStart }) {
    return (
        <StartScreenContainer>
            <h1>Welcome to Color Collapse!</h1>
            <p>Click on groups of same-colored squares to remove them.</p>
            <StartButton onClick={onStart}>Start Game</StartButton>
        </StartScreenContainer>
    );
}

export default StartScreen;