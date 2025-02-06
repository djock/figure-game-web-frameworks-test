import React, { useState, useEffect } from 'react';
import Shape from './Shape';

function GameArea({ onShapeClick }) {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    // Generate initial shapes when the component mounts
    generateShapes();
  }, []);

  const generateShapes = () => {
    const newShapes = [];
    for (let i = 0; i < 5; i++) {
      const shapeType = ['square', 'circle', 'triangle'][Math.floor(Math.random() * 3)];
      const shapeSize = 50 + Math.floor(Math.random() * 50);
      const shapeColor = `hsl(${Math.random() * 360}, 70%, 50%)`; // Random color
      newShapes.push({
        id: i,
        type: shapeType,
        size: shapeSize,
        color: shapeColor,
      });
    }
    setShapes(newShapes);
  };

  const handleShapeClick = (shapeId) => {
    onShapeClick(shapeId); // Pass the clicked shape's ID to the parent component
  };

  return (
    <div>
      {shapes.map((shape) => (
        <Shape
          key={shape.id}
          type={shape.type}
          size={shape.size}
          color={shape.color}
          onClick={() => handleShapeClick(shape.id)}
        />
      ))}
    </div>
  );
}

export default GameArea;