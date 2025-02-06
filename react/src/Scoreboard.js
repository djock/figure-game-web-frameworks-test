import React from 'react';
import styled from 'styled-components';

const ScoreboardContainer = styled.div`
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

function Scoreboard({ score, level }) {
    return (
        <ScoreboardContainer>
            <p>Score: {score}</p>
            <p>Level: {level}</p>
        </ScoreboardContainer>
    );
}

export default Scoreboard;