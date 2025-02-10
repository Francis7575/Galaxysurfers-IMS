import React, { useEffect, useRef, useState } from 'react';
import { Mesh } from 'three';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';
interface DraggableBoxProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  name: string;
  setPosition: (position: [number, number, number]) => void;
  otherBoxes: { position: [number, number, number]; size: [number, number, number] }[]; // other boxes with size
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  onClick: (event: ThreeEvent<MouseEvent>) => void;
  onDrag: (newPosition: [number, number, number]) => void;
}

const DraggableBox: React.FC<DraggableBoxProps> = ({
  position,
  size,
  color,
  setPosition,
  otherBoxes,
  onDragStart,
  onDragEnd,
  isDragging,
  setIsDragging,
  onClick,
  onDrag
}) => {
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const meshRef = useRef<Mesh>(null);
  const planeRef = useRef<Mesh>(null); // Reference to the plane
  const { camera } = useThree();
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(position);

  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    onDragStart();
    setIsDragging(true);
    setHasMoved(false);
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    onDragEnd();
    setIsDragging(false);

    // Ensure final position is updated
    if (meshRef.current) {
      const finalPosition = meshRef.current.position.toArray() as [number, number, number];
      setCurrentPosition(finalPosition);
      setPosition(finalPosition); 
  }

    if (!hasMoved) {
      onClick(event);
    }
    setHasMoved(false);

  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!meshRef.current || !isDragging) return;

    // Convert screen movement to world space
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (planeRef.current) {
      const intersects = raycaster.intersectObject(planeRef.current);

      if (intersects.length > 0) {
        const intersectPoint = intersects[0].point;

        // Compute new position based on intersection point
        const newPosition: [number, number, number] = [
          intersectPoint.x,
          currentPosition[1],
          intersectPoint.z,
        ];

        // Check for collisions only with boxes that are not currently being dragged
        const filteredOtherBoxes = otherBoxes.filter(box => box.position !== currentPosition);

        if (!isColliding(newPosition, size, filteredOtherBoxes)) {
          meshRef.current.position.set(...newPosition);
          setCurrentPosition(newPosition);
          setPosition(newPosition); 
          setHasMoved(true);
          
          // Trigger the onDrag function when the box is moved
          onDrag(newPosition);
        }
      }
    }
  };

  const isColliding = (
    newPosition: [number, number, number],
    size: [number, number, number],
    otherBoxes: { position: [number, number, number]; size: [number, number, number] }[]
  ) => {
    const [newX, newY, newZ] = newPosition;
    const [boxWidth, boxHeight, boxDepth] = size;

    for (const { position: [otherX, otherY, otherZ], size: [otherWidth, otherHeight, otherDepth] } of otherBoxes) {
      // Check if there's an overlap on all three axes
      const isOverlappingX = newX < otherX + otherWidth && newX + boxWidth > otherX;
      const isOverlappingY = newY < otherY + otherHeight && newY + boxHeight > otherY; // Use Y values
      const isOverlappingZ = newZ < otherZ + otherDepth && newZ + boxDepth > otherZ;

      // If there is overlap in all axes, then a collision is detected
      if (isOverlappingX && isOverlappingY && isOverlappingZ) {
        return true; // Collision detected
      }
    }
    return false; // No collision
  };

  return (
    <>
      <mesh
        ref={planeRef} // Assign ref to the plane
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="lightblue" />
        <Edges color="black" />
      </mesh>
      <mesh
        ref={meshRef}
        position={currentPosition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={(e) => {
          e.stopPropagation();
          onClick(e);
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
        <Edges color="black" />
      </mesh>
    </>
  );
};

export default DraggableBox;