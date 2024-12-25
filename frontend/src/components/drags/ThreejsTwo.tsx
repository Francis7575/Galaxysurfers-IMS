import React, { useState, useEffect } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { Edges, OrbitControls, Plane } from "@react-three/drei";
import { useLocation } from "react-router-dom";
import DraggableBox from "./DraggableBox";
import { Heading } from "../";
import BackBtn from "/assets/back-button.svg";
import { Link } from "react-router-dom";

type LocationState = {
  idloc: number;
  idwarehouse: number;
  warehouse: string;
};

const Threejs2: React.FC = () => {
  const location = useLocation();
  const { idloc, idwarehouse, warehouse } = location.state as LocationState;

  console.log(idloc);

  const [isDragging, setIsDragging] = useState(false);
  const [boxPositions, setBoxPositions] = useState<[number, number, number][]>(
    []
  );
  const [boxSizes, setBoxSizes] = useState<[number, number, number][]>([]);
  const [boxColors, setBoxColors] = useState<string[]>([]);
  const [boxNames, setBoxNames] = useState<string[]>([]);
  const [boxIdLoc, setIdLoc] = useState<number[]>([]);

  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  console.log(selectedBoxIndex);

  const handleBoxClick = (index: number, event: ThreeEvent<MouseEvent>) => {
    setSelectedBoxIndex(index);
    console.log(event);
  };

  const updateBoxPosition = (
    index: number,
    newPos: [number, number, number]
  ) => {
    setBoxPositions((prev) => {
      const newPositions = [...prev];
      newPositions[index] = newPos;
      return newPositions;
    });
  };

  useEffect(() => {
    const fetchSavedLocations = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_REACT_BACKEND_URL
          }/warehouses/get-locations/${idwarehouse}`
        );
        if (response.ok) {
          const data = await response.json();

          console.log(data);
          setBoxPositions(
            data.map((item: any) => item.position_loc.split(",").map(Number))
          );
          setBoxSizes(
            data.map((item: any) => item.size_loc.split(",").map(Number))
          );
          setBoxColors(data.map((item: any) => item.color_loc));
          setBoxNames(data.map((item: any) => item.name_loc));
          setIdLoc(data.map((item: any) => item.idloc));
        } else {
          console.error("Failed to fetch locations.");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchSavedLocations();
  }, [idwarehouse]);

  return (
    <>
      <div className="930:flex-1 font-manrope">
        <div className="hidden 930:block">
          <Link to="/inventory">
            <Heading title="Warehouse Configuration" />
          </Link>
        </div>
        <div className="px-[40px] 930:px-0 mb-[27px] 930:mb-[34px]">
          <div
            className="pt-[25px] 930:text-left border-b border-lightgray pb-[17px]
                        930:pl-[29px] 930:py-[30px] 930:w-full 930:border-none 930:pb-0 flex items-center"
          >
            <Link to="/inventory" className="930:hidden max-w-[18px]">
              <img src={BackBtn} alt="Back button" />
            </Link>
            <div className="flex-grow flex justify-center 930:justify-start text-[1.15rem]">
              <h2 className="font-medium">
                <span className="text-red">{warehouse}</span> Warehouse
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[300px] w-full md:max-w-[500px] 930:max-w-none mx-auto 930:mx-0 930:px-[29px]">
        <div className="flex mt-3">
          <div className="w-full border md:w-2/3 h-[50vh] md:h-[50vh] md:min-w-[500px]">
            <Canvas
              shadows
              className="w-full h-full"
              camera={{ position: [10, 10, 10], fov: 50 }}
            >
              <ambientLight />
              <pointLight position={[10, 10, 10]} />

              <Plane
                args={[20, 20]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.5, 0]} // Adjusted height to make the boxes appear closer to the ground
                receiveShadow
              >
                <meshStandardMaterial color="lightblue" />
                <Edges color="black" />
              </Plane>

              {boxPositions.map((pos, index) => {
                const isHighlighted = boxIdLoc[index] === idloc;
                console.log(isHighlighted);

                return (
                  <DraggableBox
                    key={index}
                    position={pos}
                    size={boxSizes[index]}
                    color={isHighlighted ? "red" : boxColors[index]}
                    name={boxNames[index]}
                    setPosition={(newPos) => updateBoxPosition(index, newPos)}
                    otherBoxes={boxPositions
                      .map((pos, i) => ({ position: pos, size: boxSizes[i] }))
                      .filter((_, i) => i !== index)}
                    onDrag={() => {}}
                    onDragStart={() => {}}
                    onDragEnd={() => {}}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                    onClick={(e) => handleBoxClick(index, e)}
                  />
                );
              })}

              <OrbitControls enabled={!isDragging} />
            </Canvas>
          </div>
        </div>
      </div>
    </>
  );
};

export default Threejs2;
