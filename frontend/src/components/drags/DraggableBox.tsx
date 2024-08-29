import React, { useRef, useState } from 'react';
import { Mesh,  } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { Edges } from '@react-three/drei';

interface DraggableBoxProps {
  position: [number, number, number];
  // rotation: [number, number, number];
  size: [number, number, number];
  color: string;
  name: string;
  setPosition: (position: [number, number, number]) => void;
  // setRotation: (position: [number, number, number]) => void;
  otherBoxes: [number, number, number][];
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  onClick: (event: ThreeEvent<MouseEvent>) => void; // Use the Three.js event type
}

const DraggableBox: React.FC<DraggableBoxProps> = ({
  position,
  size,
  color,
  setPosition,
  onDragStart,
  onDragEnd,
  isDragging,
  setIsDragging,
  onClick,
  // rotation
}) => {
  const [hasMoved, setHasMoved] = useState(false);
  const meshRef = useRef<Mesh>(null);
  const SCENE_BOUNDARY = 10;

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    onDragStart();
    setIsDragging(true);
    setHasMoved(false); // Reset the movement state when starting a drag
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    onDragEnd();
    setIsDragging(false);

    if (!hasMoved) {
      onClick(event);
    }
    setHasMoved(false);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!meshRef.current || !isDragging) return;

    // Calculate the movement deltas based on the mouse movement
    const deltaX = event.movementX / 50;
    const deltaZ = event.movementY / 50;

    // Keep the y position fixed to ensure the box stays on the platform
    const newPosition: [number, number, number] = [
      position[0] + deltaX,
      position[1], // y position remains unchanged
      position[2] + deltaZ,
    ];

    // Ensure the box doesn't go out of bounds on the x and z axes
    const clampedPosition: [number, number, number] = [
      Math.min(Math.max(newPosition[0], -SCENE_BOUNDARY), SCENE_BOUNDARY),
      position[1], // y position remains unchanged
      Math.min(Math.max(newPosition[2], -SCENE_BOUNDARY), SCENE_BOUNDARY),
    ];

    // Update the position state only if there's an actual movement
    if (
      clampedPosition[0] !== position[0] ||
      clampedPosition[2] !== position[2] // Only check x and z positions
    ) {
      setPosition(clampedPosition);
      setHasMoved(true);
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e); // Pass the event to the handler
      }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
      <Edges color="black" />
    </mesh>
  );
};

export default DraggableBox;
