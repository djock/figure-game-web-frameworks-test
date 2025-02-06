import React from 'react';
import styled from 'styled-components';

const GameOverContainer = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #ffebee;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const RestartButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

function GameOverScreen({ score, onRestart }) {
    return (
        <GameOverContainer>
            <h2>Game Over!</h2>
            <p>Your final score: {score}</p>
            <RestartButton onClick={onRestart}>Restart Game</RestartButton>
        </GameOverContainer>
    );
}

export default GameOverScreen;