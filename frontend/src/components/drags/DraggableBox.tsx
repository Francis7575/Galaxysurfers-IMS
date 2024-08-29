import React, { useRef, useState } from 'react';
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
  otherBoxes: [number, number, number][];
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  onClick: (event: ThreeEvent<MouseEvent>) => void;
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
}) => {
  const [hasMoved, setHasMoved] = useState(false);
  const meshRef = useRef<Mesh>(null);
  const planeRef = useRef<Mesh>(null); // Reference to the plane
  const { camera } = useThree();

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

    if (!hasMoved) {
      onClick(event);
    }
    setHasMoved(false);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!meshRef.current || !isDragging) return;


    // Convert screen movement to world space
    const planeNormal = new THREE.Vector3(0, 1, 0); 
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
          position[1],
          intersectPoint.z,
        ];

        setPosition(newPosition);
        setHasMoved(true);
      }
    }
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
        position={position}
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
